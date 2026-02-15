#!/bin/bash
# Generate patch file for sharing changes with dev team

# Usage:
#   ./generate-patch.sh              # Creates patch of all uncommitted changes
#   ./generate-patch.sh -1           # Creates patch of last commit
#   ./generate-patch.sh -3           # Creates patch of last 3 commits
#   ./generate-patch.sh abc123       # Creates patch from commit abc123 to HEAD

PATCH_DIR="patches"
mkdir -p "$PATCH_DIR"

if [ -z "$1" ]; then
  # No argument: create patch of uncommitted changes
  PATCH_FILE="$PATCH_DIR/uncommitted-changes-$(date +%Y%m%d-%H%M%S).patch"
  git diff > "$PATCH_FILE"
  echo "✅ Created patch of uncommitted changes: $PATCH_FILE"
  
elif [[ "$1" =~ ^-[0-9]+$ ]]; then
  # Argument like -1, -3: create patch of last N commits
  git format-patch "$1" -o "$PATCH_DIR"
  echo "✅ Created patch(es) in: $PATCH_DIR/"
  ls -1 "$PATCH_DIR"/*.patch 2>/dev/null | tail -n ${1#-}
  
else
  # Argument is commit hash: create patch from that commit to HEAD
  git format-patch "$1" -o "$PATCH_DIR"
  echo "✅ Created patch(es) from $1 to HEAD in: $PATCH_DIR/"
  ls -1 "$PATCH_DIR"/*.patch 2>/dev/null
fi

echo ""
echo "📤 Send the patch file(s) to your dev team."
echo "🔧 They can apply with: git apply <patch-file>"
