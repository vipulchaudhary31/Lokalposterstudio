import { useRef, useState, useCallback, useEffect } from 'react';
import type { TextAlignment, TextShadow, TextStroke } from './TextStyleEditor';
import { buildCombinedTextShadow } from './TextStyleEditor';
import { computeSnap, computeResizeSnap, circleToRect, nameToRect } from './snap-engine';
import type { Rect, SnapGuide } from './snap-engine';

type Corner = 'tl' | 'tr' | 'bl' | 'br' | null;

interface DraggablePlaceholderProps {
  type: 'circle' | 'rectangle';
  x: number;
  y: number;
  width?: number;
  height: number;
  canvasScale: number;
  onDrag: (x: number, y: number) => void;
  onResizeDiameter?: (diameter: number) => void;
  /** Combined update for circle: position + diameter in one call */
  onCircleChange?: (x: number, y: number, diameter: number) => void;
  minDiameter?: number;
  maxDiameter?: number;
  label: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  textShadow?: TextShadow;
  textStroke?: TextStroke;
  userPhoto?: string | null;
  canvasWidth: number;
  canvasHeight: number;
  textAlignment?: TextAlignment;
  letterSpacing?: number;
  photoShape?: 'circle' | 'square';
  photoCornerRadius?: number;
  photoStrokeWidth?: number;
  photoStrokeColor?: string;
  // ── Snap / selection props ──
  isSelected?: boolean;
  onSelect?: () => void;
  otherRects?: Rect[];
  onActiveGuides?: (guides: SnapGuide[]) => void;
  /** Reports the live moving rect during drag (for distance indicators) */
  onDragRect?: (rect: Rect | null) => void;
}

const CORNER_HIT_SIZE = 18;

function getCorner(localX: number, localY: number, boxW: number, boxH: number): Corner {
  const isLeft = localX < CORNER_HIT_SIZE;
  const isRight = localX > boxW - CORNER_HIT_SIZE;
  const isTop = localY < CORNER_HIT_SIZE;
  const isBottom = localY > boxH - CORNER_HIT_SIZE;
  if (isTop && isLeft) return 'tl';
  if (isTop && isRight) return 'tr';
  if (isBottom && isLeft) return 'bl';
  if (isBottom && isRight) return 'br';
  return null;
}

function cornerCursor(c: Corner): string {
  if (c === 'tl' || c === 'br') return 'nwse-resize';
  if (c === 'tr' || c === 'bl') return 'nesw-resize';
  return 'grab';
}

export function DraggablePlaceholder({
  type,
  x,
  y,
  width,
  height,
  canvasScale,
  onDrag,
  onResizeDiameter,
  onCircleChange,
  minDiameter = 100,
  maxDiameter = 600,
  label,
  fontSize = 48,
  fontWeight = 600,
  textColor = '#FFFFFF',
  textShadow = { offsetX: 0, offsetY: 0, blur: 0, color: '#000000', opacity: 0 },
  textStroke = { width: 0, color: '#000000' },
  userPhoto = null,
  canvasWidth,
  canvasHeight,
  textAlignment = 'center',
  letterSpacing = 0,
  photoShape = 'circle',
  photoCornerRadius = 16,
  photoStrokeWidth = 0,
  photoStrokeColor = '#FFFFFF',
  isSelected = false,
  onSelect,
  otherRects = [],
  onActiveGuides,
  onDragRect,
}: DraggablePlaceholderProps) {
  const safeScale = canvasScale || 1;

  // ── shared visual state ──
  const [hoveredCorner, setHoveredCorner] = useState<Corner>(null);
  const [interacting, setInteracting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // ── pointer-capture refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerState = useRef<{
    action: 'move' | 'resize';
    corner: Corner;
    startPointerX: number;
    startPointerY: number;
    startX: number;
    startY: number;
    startDiameter: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  // Live position/size during gesture
  const [liveX, setLiveX] = useState(x);
  const [liveY, setLiveY] = useState(y);
  const [liveDiameter, setLiveDiameter] = useState(height);

  // Sync live values from props when not interacting
  useEffect(() => {
    if (!interacting) {
      setLiveX(x);
      setLiveY(y);
      setLiveDiameter(height);
    }
  }, [x, y, height, interacting]);

  // Clear guides + drag rect when not interacting
  useEffect(() => {
    if (!interacting) {
      onActiveGuides?.([]);
      onDragRect?.(null);
    }
  }, [interacting]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Clamp helpers ──
  const clampCirclePos = useCallback(
    (px: number, py: number, d: number) => ({
      x: Math.max(0, Math.min(canvasWidth - d, px)),
      y: Math.max(0, Math.min(canvasHeight - d, py)),
    }),
    [canvasWidth, canvasHeight],
  );

  const clampRectPos = useCallback(
    (px: number, py: number, w: number, h: number) => ({
      x: Math.max(0, Math.min(canvasWidth - w, px)),
      y: Math.max(0, Math.min(canvasHeight - h, py)),
    }),
    [canvasWidth, canvasHeight],
  );

  const clampDiameter = useCallback(
    (d: number) => Math.max(minDiameter, Math.min(maxDiameter, d)),
    [minDiameter, maxDiameter],
  );

  // ── Snap helper ──
  const applySnap = useCallback(
    (rect: Rect) => computeSnap(rect, otherRects, canvasWidth, canvasHeight),
    [otherRects, canvasWidth, canvasHeight],
  );

  // ══════════════ POINTER DOWN ══════════════
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect?.();

      const el = containerRef.current;
      if (!el) return;
      el.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const corner = (type === 'circle' && onResizeDiameter)
        ? getCorner(localX, localY, rect.width, rect.height)
        : null;

      pointerState.current = {
        action: corner ? 'resize' : 'move',
        corner,
        startPointerX: e.clientX,
        startPointerY: e.clientY,
        startX: type === 'circle' ? liveX : x,
        startY: type === 'circle' ? liveY : y,
        startDiameter: type === 'circle' ? liveDiameter : height,
        startWidth: width || height,
        startHeight: height,
      };

      setInteracting(true);
      setIsResizing(!!corner);
    },
    [type, liveX, liveY, liveDiameter, x, y, width, height, onResizeDiameter, onSelect],
  );

  // ══════════════ POINTER MOVE ══════════════
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ps = pointerState.current;
      if (!ps) {
        // Hover cursor tracking for circle
        if (type === 'circle' && onResizeDiameter && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setHoveredCorner(getCorner(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height));
        }
        return;
      }
      e.preventDefault();

      const dx = (e.clientX - ps.startPointerX) / safeScale;
      const dy = (e.clientY - ps.startPointerY) / safeScale;

      if (type === 'circle') {
        if (ps.action === 'move') {
          const rawX = ps.startX + dx;
          const rawY = ps.startY + dy;
          const clamped = clampCirclePos(rawX, rawY, ps.startDiameter);
          const movingRect = circleToRect(clamped.x, clamped.y, ps.startDiameter);
          const snap = applySnap(movingRect);
          const finalClamped = clampCirclePos(snap.x, snap.y, ps.startDiameter);
          setLiveX(finalClamped.x);
          setLiveY(finalClamped.y);
          onActiveGuides?.(snap.guides);
          onDragRect?.(circleToRect(finalClamped.x, finalClamped.y, ps.startDiameter));
        } else {
          // ── Resize with center-snap ──
          let delta: number;
          if (ps.corner === 'br') delta = Math.max(dx, dy);
          else if (ps.corner === 'bl') delta = Math.max(-dx, dy);
          else if (ps.corner === 'tr') delta = Math.max(dx, -dy);
          else delta = Math.max(-dx, -dy);

          const newD = clampDiameter(ps.startDiameter + delta);
          const actualDelta = newD - ps.startDiameter;
          let newX = ps.startX;
          let newY = ps.startY;
          if (ps.corner === 'tl') { newX -= actualDelta; newY -= actualDelta; }
          else if (ps.corner === 'tr') { newY -= actualDelta; }
          else if (ps.corner === 'bl') { newX -= actualDelta; }

          const clamped = clampCirclePos(newX, newY, newD);

          // Anchor is the FIXED corner throughout the resize gesture
          // 'br'/'tr' → left edge is fixed, 'tl'/'bl' → right edge is fixed
          const anchorX = (ps.corner === 'br' || ps.corner === 'tr')
            ? ps.startX
            : ps.startX + ps.startDiameter;
          // 'br'/'bl' → top edge is fixed, 'tl'/'tr' → bottom edge is fixed
          const anchorY = (ps.corner === 'br' || ps.corner === 'bl')
            ? ps.startY
            : ps.startY + ps.startDiameter;

          const resizeSnap = computeResizeSnap(
            clamped.x, clamped.y, newD,
            ps.corner as 'tl' | 'tr' | 'bl' | 'br',
            anchorX, anchorY,
            otherRects, canvasWidth, canvasHeight,
            minDiameter, maxDiameter,
          );

          if (resizeSnap.guides.length > 0) {
            const rsClamped = clampCirclePos(resizeSnap.x, resizeSnap.y, resizeSnap.diameter);
            setLiveX(rsClamped.x);
            setLiveY(rsClamped.y);
            setLiveDiameter(resizeSnap.diameter);
            onActiveGuides?.(resizeSnap.guides);
            onDragRect?.(circleToRect(rsClamped.x, rsClamped.y, resizeSnap.diameter));
          } else {
            setLiveX(clamped.x);
            setLiveY(clamped.y);
            setLiveDiameter(newD);
            onActiveGuides?.([]);
            onDragRect?.(circleToRect(clamped.x, clamped.y, newD));
          }
        }
      } else {
        // Rectangle (text) — Y-only move (X locked)
        const lockedX = ps.startX;
        const rawY = ps.startY + dy;
        const clamped = clampRectPos(lockedX, rawY, ps.startWidth, ps.startHeight);
        const movingRect = nameToRect(lockedX, clamped.y, ps.startWidth, ps.startHeight);
        const snap = applySnap(movingRect);
        const finalClamped = clampRectPos(lockedX, snap.y, ps.startWidth, ps.startHeight);
        setLiveX(lockedX);
        setLiveY(finalClamped.y);
        onActiveGuides?.(snap.guides);
        onDragRect?.(nameToRect(lockedX, finalClamped.y, ps.startWidth, ps.startHeight));
      }
    },
    [type, safeScale, clampCirclePos, clampRectPos, clampDiameter, onResizeDiameter, applySnap, onActiveGuides, onDragRect, otherRects, canvasWidth, canvasHeight, minDiameter, maxDiameter],
  );

  // ══════════════ POINTER UP ══════════════
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const ps = pointerState.current;
      if (!ps) return;

      const el = containerRef.current;
      if (el) el.releasePointerCapture(e.pointerId);
      pointerState.current = null;
      setInteracting(false);
      setIsResizing(false);
      onActiveGuides?.([]);
      onDragRect?.(null);

      if (type === 'circle') {
        if (onCircleChange) {
          onCircleChange(Math.round(liveX), Math.round(liveY), Math.round(liveDiameter));
        } else {
          onDrag(Math.round(liveX), Math.round(liveY));
          if (ps.action === 'resize' && onResizeDiameter) {
            onResizeDiameter(Math.round(liveDiameter));
          }
        }
      } else {
        onDrag(Math.round(liveX), Math.round(liveY));
      }
    },
    [type, liveX, liveY, liveDiameter, onDrag, onResizeDiameter, onCircleChange, onActiveGuides, onDragRect],
  );

  // ══════════════ Computed visual values ══════════════
  const displayX = interacting ? liveX : x;
  const displayY = interacting ? liveY : y;
  const displayDiameter = type === 'circle' ? (interacting ? liveDiameter : height) : height;
  const displayWidth = width || height;
  const scaledWidth = displayWidth * safeScale;
  const scaledHeight = height * safeScale;

  // Build text shadow (for rectangle type)
  const scaledCombinedShadow = buildCombinedTextShadow(
    { ...textShadow, offsetX: textShadow.offsetX * safeScale, offsetY: textShadow.offsetY * safeScale, blur: textShadow.blur * safeScale },
    { ...textStroke, width: textStroke.width * safeScale },
  );

  const strokePad = textStroke.width;
  const shadowPad = Math.max(textShadow.blur + Math.max(Math.abs(textShadow.offsetX), Math.abs(textShadow.offsetY)), 0);
  const totalPad = Math.max(strokePad, shadowPad);
  const scaledPad = totalPad * safeScale;

  // ── Cursor for circle ──
  const circleCursor = interacting
    ? isResizing ? cornerCursor(pointerState.current?.corner ?? null) : 'grabbing'
    : hoveredCorner ? cornerCursor(hoveredCorner) : 'grab';

  // ══════════════ RENDER: CIRCLE ══════════════
  if (type === 'circle') {
    const scaledDisplaySize = displayDiameter * safeScale;

    return (
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { if (!pointerState.current) setHoveredCorner(null); }}
        className="group absolute"
        style={{
          left: displayX * safeScale,
          top: displayY * safeScale,
          width: scaledDisplaySize,
          height: scaledDisplaySize,
          cursor: circleCursor,
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {/* The visual shape */}
        <div
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            border: photoStrokeWidth > 0 ? `${photoStrokeWidth * safeScale}px solid ${photoStrokeColor}` : 'none',
            borderRadius: photoShape === 'circle' ? '9999px' : `${photoCornerRadius * safeScale}px`,
            boxSizing: 'border-box',
            backgroundColor: userPhoto
              ? 'transparent'
              : interacting ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          }}
        >
          {userPhoto ? (
            <img src={userPhoto} alt="User Photo" className="w-full h-full object-cover pointer-events-none" draggable={false} />
          ) : (
            <div className="text-muted-foreground text-xs px-3 py-1.5 rounded-full text-center pointer-events-none">
              {label}
            </div>
          )}
        </div>

        {/* Corner handles */}
        {onResizeDiameter && (
          <>
            {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => {
              const isActive = hoveredCorner === corner || isResizing;
              return (
                <div
                  key={corner}
                  className={`absolute z-20 transition-all duration-150 ${
                    isActive || interacting
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
                  }`}
                  style={{
                    top: corner.startsWith('t') ? -5 : undefined,
                    bottom: corner.startsWith('b') ? -5 : undefined,
                    left: corner.endsWith('l') ? -5 : undefined,
                    right: corner.endsWith('r') ? -5 : undefined,
                    width: 12, height: 12,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    className={`w-full h-full rounded-sm shadow-md border-2 ${
                      hoveredCorner === corner ? 'bg-primary border-primary scale-125' : 'bg-white border-primary/70'
                    }`}
                    style={{ transition: 'all 100ms ease' }}
                  />
                </div>
              );
            })}

            {/* Size badge during resize */}
            {isResizing && (
              <div
                className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md whitespace-nowrap z-30 shadow-lg backdrop-blur-sm text-[11px] font-mono"
                style={{
                  bottom: -30,
                  background: 'oklch(0.26 0.009 256 / 0.92)',
                  color: 'oklch(0.74 0.003 286)',
                  border: '1px solid oklch(0.355 0.012 258 / 0.5)',
                }}
              >
                {Math.round(liveDiameter)}px
              </div>
            )}
          </>
        )}

        {/* Selection outline */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-150"
          style={{
            borderRadius: photoShape === 'circle' ? '9999px' : `${photoCornerRadius * safeScale}px`,
            boxShadow: isSelected || interacting
              ? `0 0 0 2px oklch(0.768 0.1305 223.2 / 0.9)`
              : `0 0 0 1px rgba(150, 150, 150, 0.3)`,
          }}
        />
      </div>
    );
  }

  // ══════════════ RENDER: RECTANGLE (text placeholder) ══════════════
  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="group absolute"
      style={{
        left: displayX * safeScale,
        top: displayY * safeScale,
        width: scaledWidth,
        height: scaledHeight,
        cursor: interacting ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div className="relative w-full h-full">
        <div
          className={`w-full h-full transition-all`}
          style={{
            boxShadow: isSelected || interacting
              ? '0 0 0 1.5px oklch(0.768 0.1305 223.2 / 0.8)'
              : 'none',
          }}
        >
          {/* Text Content */}
          <div
            className="relative w-full h-full flex items-center"
            style={{
              padding: `0 ${scaledPad + 6}px`,
              justifyContent:
                textAlignment === 'left' ? 'flex-start'
                : textAlignment === 'right' ? 'flex-end'
                : 'center',
            }}
          >
            <span
              className="relative z-10"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                color: textColor,
                fontWeight: fontWeight,
                fontSize: fontSize * safeScale,
                lineHeight: 1,
                textShadow: scaledCombinedShadow,
                textAlign: textAlignment,
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: `${letterSpacing * safeScale}px`,
                WebkitFontSmoothing: 'antialiased' as any,
                MozOsxFontSmoothing: 'grayscale' as any,
                textRendering: 'optimizeLegibility',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}