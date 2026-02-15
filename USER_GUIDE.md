# 📱 Mobile Image Template Designer - User Guide

## 🎯 Overview

The **Mobile Image Template Designer** is an internal tool for in-house designers to create shareable, reusable mobile image templates with customizable placeholder positions and artistic styling effects. This tool allows you to design template layouts that can be used later by end-users who will add their own photos and names.

### What This Tool Does
✅ Create mobile image templates (3:4 or 9:16 aspect ratios)  
✅ Upload and position background images or videos  
✅ Place draggable photo and name placeholders  
✅ Apply artistic paint stroke effects around photos  
✅ Add text background styles  
✅ Generate AI concept backgrounds (via Gemini/OpenAI)  
✅ Export templates for end-user consumption  

### What This Tool Does NOT Do
❌ Edit individual user photos (it's a template creator, not a photo editor)  
❌ Store actual user photos (only sample photos for preview)  
❌ Process photos in bulk  
❌ Create non-mobile aspect ratios  

---

## 🚀 Quick Start Guide

### Step 1: Choose Your Workflow

You have two ways to start:

#### Option A: Generate AI Background (Recommended for Creative Concepts)
1. Click **"Step 1: Generate"** in the header
2. Enter a concept description (e.g., "Sunset beach with palm trees")
3. Configure AI settings (optional)
4. Click **"Generate Images"**
5. Select your favorite generated image
6. Proceed to template designer

#### Option B: Upload Your Own Background
1. Click **"Step 2: Design"** in the header (or "Skip to Designer")
2. Upload an image or video directly
3. Start designing your template

---

## 📐 Step-by-Step Template Creation

### **STEP 1: Select Aspect Ratio**

Choose your mobile template format:

| Aspect Ratio | Dimensions | Best For |
|-------------|-----------|----------|
| **3:4 Portrait** | 1080×1440px | Instagram posts, Facebook posts, general social media |
| **9:16 Portrait** | 1080×1920px | Instagram Stories, TikTok, Reels, full-screen mobile |

**💡 Tip**: Choose 9:16 for full-screen mobile experiences, 3:4 for standard social media posts.

---

### **STEP 2: Upload Background**

Upload your template background:

#### Supported Formats
- **Images**: JPG, PNG, WebP
- **Videos**: MP4, WebM, MOV

#### Background Guidelines
✅ Use high-resolution images (1080px width minimum)  
✅ Ensure important content is visible after cropping  
✅ Videos should be under 10MB for best performance  
✅ Consider where placeholders will be positioned  

#### Cropping Your Background
1. Upload your image/video
2. Crop dialog appears automatically
3. Adjust the visible area to fit your aspect ratio
4. Click **"Apply Crop"** (or **"Confirm"** for videos)

**💡 Pro Tip**: Leave breathing room around focal points where you'll place placeholders.

---

### **STEP 3: Position Placeholders**

Two placeholders are available:

#### 🔵 User Photo Placeholder (Circular)
- **Default Size**: 300×300px diameter
- **Purpose**: Where end-users will place their profile photo
- **Position**: Drag anywhere on the canvas

#### 📝 Name Text Placeholder (Rectangular)
- **Default Size**: 600px width × 100px height
- **Purpose**: Where end-users' names will appear
- **Position**: Drag anywhere on the canvas

#### How to Position Placeholders
1. Click and drag the **dashed circle** (photo placeholder)
2. Click and drag the **dashed rectangle** (name placeholder)
3. Position them where they look best against your background
4. Check the live preview panel on the right

**💡 Best Practice**: Position placeholders in areas with good contrast and avoid covering important background details.

---

### **STEP 4: Apply Image Stroke Effects**

Add artistic paint stroke effects around the user photo:

| Effect | Description | Best For |
|--------|-------------|----------|
| **None** | No effect, clean border | Professional, minimal designs |
| **Paint Flow** | Blue flowing paint strokes | Corporate, cool themes |
| **Vibrant Waves** | Purple/pink gradient waves | Fun, energetic designs |
| **Sunset Glow** | Orange/pink sunset gradient | Warm, welcoming themes |
| **Aurora** | Multi-color aurora effect | Playful, vibrant templates |

#### Stroke Effect Features
- ✨ Smooth, organic animations
- 🎨 Multi-layered gradient effects
- 🌊 Dancing, flowing movement
- 🔄 Loops continuously

**💡 Creative Tip**: Match stroke colors to your background palette for cohesive design.

---

### **STEP 5: Style the Name Placeholder**

Choose how the user's name should appear:

| Style | Description | Best For |
|-------|-------------|----------|
| **None** | Plain text, no background | Clean backgrounds with good contrast |
| **Solid** | Solid black background with white text | Busy backgrounds, guaranteed readability |
| **Gradient** | Amber gradient background | Eye-catching, modern designs |

#### Text Alignment Options
- **Left**: Text aligns to the left edge
- **Center**: Text centers within placeholder (default)
- **Right**: Text aligns to the right edge

**💡 Readability Tip**: Use Solid or Gradient backgrounds if your background image is complex or has varying colors.

---

### **STEP 6: Configure Metadata**

#### Primary Category (Required)
Select the main occasion/purpose:
- Good Morning
- Good Night
- Birthday
- Anniversary
- Festival
- Congratulations
- Get Well Soon
- Thank You
- Love & Romance
- Friendship
- Motivation

#### Secondary Category (Optional)
Add a subcategory for more specific targeting:
- Diwali, Holi, Christmas, etc. (for Festival)
- Wedding Anniversary, Work Anniversary (for Anniversary)
- New Baby, New Job (for Congratulations)

#### Languages (Required)
Select all languages your template supports:
- English
- Hindi
- Spanish
- French
- German
- Portuguese
- And more...

**💡 Organization Tip**: Use categories and languages to help end-users find the right template quickly.

---

### **STEP 7: Preview & Export**

#### Live Preview Panel
- **Location**: Right sidebar
- **Shows**: Real-time preview with sample data
- **Updates**: Instantly as you make changes
- **Sample Name**: Default "Rahul" (you can change this in User Name field)

#### Export Your Template
1. Click **"Export Template"** button
2. Review the JSON structure (includes all settings)
3. Copy the JSON for your backend/database
4. Use this template in your end-user application

---

## 🎨 AI Concept Generator (Step 1)

### Purpose
Generate custom background images using AI (Gemini or OpenAI) based on text descriptions.

### How to Use

#### 1. Enter Your Concept
**Left Panel**: Concept Input

```
Example Prompts:
- "Beautiful sunset over calm ocean with palm trees"
- "Colorful festival celebration with fireworks"
- "Romantic candlelit dinner setting"
- "Motivational mountain peak at sunrise"
```

#### 2. Configure AI Settings
**Right Panel**: Configuration

- **AI Provider**: Choose between Gemini or OpenAI
- **API Key**: Enter your API key (required for real generation)
- **System Prompt Toggle**: 
  - **ON**: Uses predefined mobile-optimized prompts
  - **OFF**: Allows custom prompts for more control
- **Custom Prompt**: Available when toggle is OFF

#### 3. Generate Images
1. Click **"Generate Images"**
2. Wait for AI to generate (may take 10-30 seconds)
3. Review generated images
4. Click **"Use This Image"** on your favorite
5. Proceeds to Step 2 (Template Designer)

### Mock Mode
If no valid API key is provided, the tool uses **Unsplash** images as placeholders. This is perfect for:
- Testing the tool
- Exploring features
- Creating mockups

**💡 Production Tip**: Always use real AI generation for production templates to ensure unique, on-brand visuals.

---

## 🎬 Video Backgrounds

### Supported Features
✅ Upload video files as backgrounds  
✅ Auto-loop playback  
✅ Audio on/off toggle  
✅ Preview in real-time  

### Video Audio Control

When you upload a video, a new section appears:

**🔊 Video Audio**
- **Default**: Muted (no sound)
- **Enable Audio**: Check to hear video sound
- **Applies to**: Both Design Canvas and Live Preview

#### Why Audio is Muted by Default
- Browser autoplay policies require muted videos
- Prevents unexpected audio during editing
- Enables quiet working environment

#### When to Enable Audio
✅ Testing video greeting templates with music  
✅ Previewing templates with voiceovers  
✅ Checking audio synchronization  
✅ Verifying sound quality  

**💡 Browser Note**: Enabling audio works because the user interaction (checking the box) allows browsers to play audio.

---

## 🎯 Best Practices

### Design Guidelines

#### 1. **Placeholder Positioning**
- ✅ Place placeholders where they don't block key background elements
- ✅ Ensure good contrast between placeholder area and background
- ✅ Leave ~50px margin from edges for mobile safety area
- ❌ Don't overlap placeholders unnecessarily
- ❌ Avoid placing text near video action areas

#### 2. **Background Selection**
- ✅ Use high-quality, well-lit images
- ✅ Choose backgrounds that match the template category
- ✅ Ensure backgrounds work across different devices
- ❌ Avoid extremely busy patterns
- ❌ Don't use copyrighted images without permission

#### 3. **Color & Contrast**
- ✅ Test readability with different skin tones in photo placeholder
- ✅ Use text backgrounds on complex backgrounds
- ✅ Match stroke effects to background color palette
- ❌ Don't use low-contrast color combinations
- ❌ Avoid white text on light backgrounds without background style

#### 4. **Stroke Effects**
- ✅ Use strokes to add visual interest and separate photo from background
- ✅ Choose stroke colors that complement the design
- ✅ Consider "None" for minimalist, professional templates
- ❌ Don't use conflicting colors (e.g., cool strokes on warm backgrounds)

#### 5. **Categories & Metadata**
- ✅ Always select appropriate primary category
- ✅ Add secondary category for specific occasions
- ✅ Select all applicable languages
- ❌ Don't mis-categorize templates
- ❌ Don't skip language selection

### Performance Tips

#### Image Optimization
- 📏 Use 1080px width as standard
- 🗜️ Compress images before upload (80-90% quality)
- 📦 Keep file sizes under 500KB for images
- 🎬 Keep videos under 10MB

#### Template Organization
- 📁 Use consistent naming conventions
- 🏷️ Tag templates with detailed metadata
- 📊 Track which templates perform best
- 🔄 Update templates seasonally

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### Issue: "Can't see my uploaded image"
**Solution**: 
- Ensure file format is supported (JPG, PNG, WebP)
- Check file size (under 10MB recommended)
- Try refreshing the page
- Check browser console for errors

#### Issue: "Video won't play"
**Solution**:
- Verify video format (MP4 recommended)
- Check file size (under 10MB)
- Ensure video codec is H.264 (widely supported)
- Try converting video to MP4

#### Issue: "No sound from video"
**Solution**:
- Look for **"Video Audio"** section in left sidebar
- Check the **"Enable Audio"** toggle
- Ensure your browser/device volume is on
- Verify video file actually has audio

#### Issue: "Generated images don't match my prompt"
**Solution**:
- Be more specific in your description
- Use descriptive adjectives (e.g., "vibrant sunset" not just "sunset")
- Turn OFF system prompt toggle for full control
- Try different AI providers (Gemini vs OpenAI)

#### Issue: "Placeholder positions reset when I change aspect ratio"
**Solution**:
- This is expected behavior to prevent placeholders from going off-canvas
- Placeholders clamp to valid positions
- Reposition placeholders after changing aspect ratio

#### Issue: "Stroke effects not visible"
**Solution**:
- Ensure you selected a stroke style other than "None"
- Check that stroke colors have contrast with background
- Try a different stroke effect
- Check browser supports CSS animations

#### Issue: "Export button doesn't do anything"
**Solution**:
- Ensure you've completed all required steps:
  - ✅ Uploaded background
  - ✅ Selected category
  - ✅ Selected at least one language
- Check browser console for errors
- Try refreshing and re-doing steps

#### Issue: "Border/dashed outline always visible in preview"
**Solution**:
- The dashed border is only visible during editing
- Set stroke style to "None" if you don't want any photo border
- Check **"Show Border in Editor"** toggle (only affects editor view)
- Final exported templates won't have dashed borders

---

## 📋 Keyboard Shortcuts & Tips

### Workflow Shortcuts
- 🔄 **Switch Pages**: Use navigation in header
- 👁️ **Preview**: Check right panel in real-time
- 🎨 **Quick Test**: Change user name to see different text lengths
- 💾 **Save Work**: Copy export JSON regularly

### Design Tips
- Use **odd numbers** for positioning (feels more natural)
- Position **photo placeholder first**, then name below it
- Test with **different name lengths** (short: "Ali", long: "Krishnamurthy")
- Preview on **actual mobile device** if possible

---

## 📤 Export & Integration

### Export Format

The tool exports a JSON structure containing:

```json
{
  "aspectRatio": "3:4",
  "backgroundImage": "data:image/jpeg;base64,...",
  "mediaType": "image",
  "imageHolder": {
    "x": 390,
    "y": 200,
    "diameter": 300
  },
  "nameHolder": {
    "x": 240,
    "y": 550,
    "width": 600,
    "height": 100
  },
  "imageStrokeStyle": "vibrantWaves",
  "textBackgroundStyle": "gradient",
  "textAlignment": "center",
  "primaryCategory": "Birthday",
  "secondaryCategory": "Friend Birthday",
  "selectedLanguages": ["English", "Hindi", "Spanish"],
  "canvasWidth": 1080,
  "canvasHeight": 1440
}
```

### Integration Steps

#### 1. **Save Template to Database**
```javascript
// Store the exported JSON in your backend
const template = exportedJSON;
await saveTemplateToDatabase(template);
```

#### 2. **Serve Templates to End-Users**
```javascript
// Retrieve templates based on category/language
const templates = await getTemplates({
  category: "Birthday",
  language: "English"
});
```

#### 3. **Render User Versions**
```javascript
// When end-user selects a template:
// 1. Load template JSON
// 2. Replace sample photo with user's photo
// 3. Replace sample name with user's name
// 4. Render final image
```

#### 4. **Generate Final Image**
Use HTML Canvas API or server-side rendering:
```javascript
// Pseudo-code
canvas.width = template.canvasWidth;
canvas.height = template.canvasHeight;
drawBackground(template.backgroundImage);
drawUserPhoto(userPhoto, template.imageHolder);
drawUserName(userName, template.nameHolder, template.textBackgroundStyle);
applyStrokeEffect(template.imageStrokeStyle);
```

---

## 🎓 Advanced Features

### Show Border in Editor Toggle

**Purpose**: Control visibility of placeholder borders during editing

**Location**: Appears in left sidebar when stroke style is "None"

**Behavior**:
- **ON**: Shows dashed white borders (helps positioning)
- **OFF**: Hides borders (preview final look)

**Use Case**: When using stroke style "None", you might want to hide the dashed border to preview the clean, borderless look.

**💡 Note**: This only affects the editor view. Final exported templates don't include these borders.

---

### Custom User Name Preview

**Purpose**: Test how different names look in your template

**How to Use**:
1. Find **"User Name"** input in left sidebar
2. Type any name (default: "Rahul")
3. Preview updates in real-time

**Test Cases**:
- Short names: "Ali", "Mo", "Sue"
- Medium names: "Rahul", "Sarah", "David"
- Long names: "Krishnamurthy", "Bartholomew"
- Special characters: "José", "François", "Müller"

**💡 Design Tip**: Ensure your name placeholder width accommodates long names without overflow.

---

## 📊 Template Categories Reference

### Primary Categories

| Category | Use Cases | Popular Occasions |
|----------|-----------|-------------------|
| **Good Morning** | Daily greetings, motivational messages | Every day, special mornings |
| **Good Night** | Evening wishes, sleep well messages | Every evening |
| **Birthday** | Birthday celebrations | Personal birthdays, milestone birthdays |
| **Anniversary** | Celebrating milestones | Wedding, work, relationship anniversaries |
| **Festival** | Holiday celebrations | Diwali, Christmas, Eid, Hanukkah |
| **Congratulations** | Achievement celebrations | Graduations, promotions, new baby |
| **Get Well Soon** | Health & recovery wishes | Illness, surgery, recovery |
| **Thank You** | Gratitude expressions | Gifts, favors, help received |
| **Love & Romance** | Romantic messages | Valentine's Day, date nights |
| **Friendship** | Celebrating friendships | Friendship Day, reunion |
| **Motivation** | Inspirational content | Goal setting, encouragement |

### Recommended Backgrounds by Category

| Category | Background Ideas |
|----------|------------------|
| **Good Morning** | Sunrise, coffee cups, nature scenes |
| **Good Night** | Stars, moon, night sky, calm scenes |
| **Birthday** | Balloons, confetti, cakes, party decorations |
| **Anniversary** | Roses, romantic settings, champagne |
| **Festival** | Holiday-specific decorations, lights, fireworks |
| **Congratulations** | Confetti, ribbons, success symbols |
| **Get Well Soon** | Flowers, peaceful nature, comforting colors |
| **Thank You** | Flowers, hearts, warm colors |
| **Love & Romance** | Hearts, roses, romantic scenery |
| **Friendship** | Fun activities, group settings, vibrant colors |
| **Motivation** | Mountains, roads, sunrise, achievement symbols |

---

## 🌍 Multi-Language Support

### Supported Languages
- English
- Hindi
- Spanish
- French
- German
- Portuguese
- Italian
- Japanese
- Korean
- Chinese
- Arabic
- Russian
- Dutch
- Swedish
- Turkish

### Language Selection Best Practices

#### When to Select Multiple Languages
✅ Generic templates (just photo + name)  
✅ Symbol-heavy designs (minimal text)  
✅ Universal occasions (Birthday, Thank You)  
✅ Templates with translatable text

#### When to Select Single Language
✅ Text-heavy backgrounds  
✅ Language-specific puns or phrases  
✅ Culture-specific designs  
✅ Region-targeted campaigns  

**💡 Tip**: More languages = higher discoverability, but ensure the design works across all selected languages.

---

## 🔒 Important Notes

### This Tool Creates Templates, Not Final Images

**Key Understanding**:
- ✅ You design the **layout** (background + placeholder positions)
- ✅ End-users will add **their own photos and names**
- ✅ The sample photo in preview is just for visualization
- ❌ User photos are NOT stored in this tool
- ❌ This is NOT a photo editing application

### Sample Photo Source
The preview uses a hardcoded sample photo from Unsplash. This is only for preview purposes to help you visualize how the template will look.

### Data Storage
- ✅ Template backgrounds are stored (image/video)
- ✅ Placeholder positions are stored
- ✅ Style preferences are stored
- ✅ Metadata (categories, languages) is stored
- ❌ User photos are NOT stored
- ❌ User names are NOT stored (except the preview name)

---

## 📞 Need Help?

### Before Asking for Help

1. ✅ Check this guide thoroughly
2. ✅ Review the Troubleshooting section
3. ✅ Check browser console for errors
4. ✅ Try refreshing the page
5. ✅ Test in a different browser

### Reporting Issues

When reporting a problem, include:
- 🖥️ Browser name and version
- 📱 Operating system
- 📋 Steps to reproduce the issue
- 🖼️ Screenshots if applicable
- 📝 Error messages from console
- 🎯 What you expected vs what happened

---

## 🎉 Quick Reference Checklist

Use this checklist when creating a new template:

### Pre-Design
- [ ] Decide on aspect ratio (3:4 or 9:16)
- [ ] Choose or generate background image/video
- [ ] Consider target category and audience

### Design Phase
- [ ] Upload and crop background
- [ ] Position user photo placeholder
- [ ] Position name placeholder
- [ ] Apply image stroke effect (if desired)
- [ ] Configure text background style
- [ ] Set text alignment
- [ ] Enable video audio (if using video with sound)

### Configuration
- [ ] Select primary category
- [ ] Add secondary category (optional)
- [ ] Select all applicable languages
- [ ] Test with different user names

### Final Review
- [ ] Check live preview
- [ ] Verify placeholder positions
- [ ] Test readability of text
- [ ] Ensure good contrast
- [ ] Review all metadata

### Export
- [ ] Click "Export Template"
- [ ] Copy JSON data
- [ ] Save to your system/database
- [ ] Test in end-user application

---

## 📚 Glossary

| Term | Definition |
|------|------------|
| **Template** | Reusable design layout with placeholders for user content |
| **Placeholder** | Designated area where user content (photo/name) will appear |
| **Aspect Ratio** | Proportional relationship between width and height |
| **Stroke Effect** | Artistic paint-like border around photo placeholder |
| **Canvas** | The main design area where you position elements |
| **Design Canvas** | The left editing area with draggable placeholders |
| **Live Preview** | Right panel showing real-time preview with sample data |
| **Mock Mode** | Using Unsplash images instead of real AI generation |
| **Export** | Converting your template design to JSON format |

---

## ✨ Tips for Creating Great Templates

### Visual Design
1. 🎨 **Balance**: Distribute visual weight evenly
2. 🌈 **Color Harmony**: Match colors across background, strokes, and text
3. 📐 **Alignment**: Keep elements aligned for professional look
4. 🔲 **White Space**: Don't overcrowd the design
5. 👁️ **Focal Point**: Guide viewer's eye to the photo placeholder

### User Experience
1. 📱 **Mobile First**: Remember these are mobile templates
2. 👆 **Touch Targets**: Consider mobile interaction areas
3. 📖 **Readability**: Ensure text is legible on all backgrounds
4. 🎯 **Purpose**: Design should match the category/occasion
5. 🌍 **Cultural Sensitivity**: Consider diverse audience

### Technical Quality
1. 📏 **Resolution**: Use high-quality source materials
2. ⚡ **Performance**: Keep file sizes reasonable
3. 🔄 **Flexibility**: Test with various name lengths
4. ✅ **Validation**: Preview before exporting
5. 📋 **Documentation**: Note any special considerations

---

## 🎬 Tutorial: Create Your First Template

### Exercise: Birthday Template

**Goal**: Create a vibrant birthday template with balloon background

#### Step-by-Step:

1. **Select Aspect Ratio**: Choose **3:4** (1080×1440px)

2. **Generate Background**: 
   - Go to Step 1: Generate
   - Enter prompt: "Colorful birthday balloons with confetti on light background"
   - Generate and select your favorite

3. **Position Placeholders**:
   - Drag photo placeholder to top-center (x: 390, y: 200)
   - Drag name placeholder below photo (x: 240, y: 550)

4. **Apply Effects**:
   - Image Stroke: **"Vibrant Waves"** (matches festive mood)
   - Text Background: **"Gradient"** (eye-catching)
   - Text Alignment: **"Center"**

5. **Configure Metadata**:
   - Primary Category: **"Birthday"**
   - Secondary Category: **"Friend Birthday"**
   - Languages: **English, Hindi, Spanish**

6. **Test**:
   - Change user name to "Maria" → "Krishnamurthy" → "Ali"
   - Verify text fits in all cases

7. **Export**: Click "Export Template" and save JSON

**🎉 Congratulations!** You've created your first template!

---

## 📖 Version History

### Current Version Features
✅ Two-page workflow (Concept Generator + Designer)  
✅ Dual aspect ratio support (3:4 and 9:16)  
✅ Image and video backgrounds  
✅ Video audio control  
✅ Four artistic stroke effects  
✅ Three text background styles  
✅ Drag-and-drop placeholder positioning  
✅ Real-time preview  
✅ AI image generation (Gemini/OpenAI)  
✅ Mock mode with Unsplash  
✅ Multi-category support  
✅ Multi-language tagging  
✅ JSON export  

---

## 🎯 Summary

This tool empowers designers to create beautiful, reusable mobile image templates quickly and efficiently. By separating template design from end-user customization, it provides:

✨ **Speed**: Design once, use many times  
✨ **Consistency**: Maintain brand standards across templates  
✨ **Flexibility**: Support multiple categories, languages, and styles  
✨ **Quality**: Professional effects and styling options  
✨ **Efficiency**: AI-powered background generation  

**Remember**: You're creating the **canvas**, not the final masterpiece. The end-users will bring it to life with their photos and names!

---

## 📝 Final Checklist for Template Quality

Before exporting any template:

- [ ] Background is high-quality and appropriate for category
- [ ] Placeholders are positioned thoughtfully
- [ ] Text is readable against background
- [ ] Stroke effect complements the design
- [ ] All metadata is accurate
- [ ] Template works with short and long names
- [ ] Design feels balanced and professional
- [ ] Preview looks good on mobile dimensions

---

**Happy Designing! 🎨**

For questions or feedback, contact your design team lead or technical support.

*Last Updated: January 2026*
