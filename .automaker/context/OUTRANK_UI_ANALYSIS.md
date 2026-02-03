# Outrank.so UI Component Library Documentation

**Comprehensive analysis of Outrank.so's UI components, design system, and visual patterns**

_Generated: 2026-01-02_
_Source: Screenshots from logged-in Outrank.so application_

---

## Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Color Palette](#color-palette)
3. [Typography System](#typography-system)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Interactive States](#interactive-states)
7. [Responsive Patterns](#responsive-patterns)
8. [Design Tokens](#design-tokens)

---

## Design System Overview

Outrank.so uses a modern, clean SaaS interface with the following characteristics:

- **Primary Style**: Minimalist content-focused design
- **Layout**: Sidebar navigation + main content area
- **Visual Language**: Subtle shadows, rounded corners, strategic use of whitespace
- **Color Strategy**: Neutral backgrounds with strategic accent colors
- **Typography**: Clean sans-serif fonts with clear hierarchy

---

## Color Palette

### Primary Colors

```
Brand Primary: #4F46E5 (Indigo-600)
- Used for: Primary buttons, active navigation, links
- Hover: #4338CA (Indigo-700)
- Active: #3730A3 (Indigo-800)

Secondary: #64748B (Slate-500)
- Used for: Secondary text, borders, muted elements
```

### Background Colors

```
Primary Background: #FFFFFF (White)
Secondary Background: #F8FAFC (Slate-50)
Card Background: #FFFFFF with subtle border
Sidebar Background: #F1F5F9 (Slate-100)
```

### Semantic Colors

```
Success: #10B981 (Emerald-500)
Success Background: #D1FAE5 (Emerald-100)

Warning: #F59E0B (Amber-500)
Warning Background: #FEF3C7 (Amber-100)

Error: #EF4444 (Red-500)
Error Background: #FEE2E2 (Red-100)

Info: #3B82F6 (Blue-500)
Info Background: #DBEAFE (Blue-100)
```

### Text Colors

```
Primary Text: #0F172A (Slate-900)
Secondary Text: #475569 (Slate-600)
Tertiary Text: #94A3B8 (Slate-400)
Disabled Text: #CBD5E1 (Slate-300)
```

### Border Colors

```
Default Border: #E2E8F0 (Slate-200)
Hover Border: #CBD5E1 (Slate-300)
Focus Border: #4F46E5 (Indigo-600)
Divider: #F1F5F9 (Slate-100)
```

---

## Typography System

### Font Families

```
Primary Font: Inter (or similar geometric sans-serif)
- Modern, readable, professional
- Used for all UI elements

Monospace Font: JetBrains Mono (or similar)
- Used for: Code snippets, technical data
```

### Type Scale

```
Display/H1: 24px / 1.2 font-weight: 600
- Usage: Page titles, main headers

H2: 20px / 1.3 font-weight: 600
- Usage: Section headers, card titles

H3: 16px / 1.4 font-weight: 600
- Usage: Subsection headers

Body Large: 15px / 1.5 font-weight: 400
- Usage: Primary content, descriptions

Body: 14px / 1.5 font-weight: 400
- Usage: Standard body text, form labels

Small: 12px / 1.4 font-weight: 400
- Usage: Metadata, timestamps, helper text

Caption: 11px / 1.4 font-weight: 500
- Usage: Tags, badges, button text
```

### Font Weights

```
Regular: 400 - Body text, labels
Medium: 500 - Emphasized text, small headers
Semibold: 600 - Headers, important text
Bold: 700 - Rarely used, for strong emphasis
```

---

## Spacing & Layout

### Spacing Scale

```
Space Scale (based on 4px grid):
- 2xs: 4px  (0.25rem)
- xs:  8px  (0.5rem)
- sm:  12px (0.75rem)
- md:  16px (1rem)
- lg:  24px (1.5rem)
- xl:  32px (2rem)
- 2xl: 48px (3rem)
```

### Component Spacing

```
Buttons:
- Padding (default): 8px 16px
- Padding (small): 6px 12px
- Padding (large): 12px 24px
- Gap between buttons: 8px

Cards:
- Padding: 20px 24px
- Gap between cards: 16px
- Border radius: 8px

Forms:
- Label to input: 6px
- Input to input: 16px
- Input padding: 8px 12px

Lists:
- Row padding: 12px 16px
- Gap between rows: 0 (border separator)
- Left padding for hierarchy: 20px per level
```

### Layout Dimensions

```
Sidebar:
- Width (collapsed): 64px
- Width (expanded): 256px
- Transition: 200ms ease-in-out

Main Content:
- Max-width: 1440px
- Padding: 24px
- Container margin: 0 auto

Header:
- Height: 64px
- Padding: 0 24px
- Border-bottom: 1px solid #E2E8F0

Cards:
- Max-width: 400px (narrow)
- Max-width: 600px (medium)
- Max-width: 800px (wide)
```

---

## Component Library

### 1. Sidebar Navigation

**Visual Characteristics:**

- Fixed left position, full height
- Semi-transparent background with backdrop blur
- Icon + label navigation items
- Active state highlighting with accent bar
- Collapsible to icon-only view

**States:**

```
Default:
- Background: #F1F5F9
- Icon color: #64748B
- Text color: #475569
- Border-right: 1px solid #E2E8F0

Hover:
- Background: #E2E8F0
- Icon color: #4F46E5
- Text color: #0F172A

Active:
- Background: #FFFFFF
- Icon color: #4F46E5
- Text color: #0F172A font-weight: 600
- Accent bar: 3px left border in #4F46E5
```

**Component Structure:**

```tsx
<Sidebar>
  <Logo />
  <NavGroup>
    <NavItem icon={Layout} label="Dashboard" active />
    <NavItem icon={Calendar} label="Scheduler" />
    <NavItem icon={FileText} label="Articles" />
  </NavGroup>
  <NavGroup title="Content">
    <NavItem icon={Plus} label="New Article" />
  </NavGroup>
  <UserProfile />
</Sidebar>
```

---

### 2. Scheduler/Calendar Interface

**Visual Characteristics:**

- Grid-based calendar layout
- Date headers with navigation
- Time slots or date cells
- Event cards with color coding
- Drag-and-drop capabilities

**Grid System:**

```
Calendar Grid:
- Columns: 7 (days of week)
- Rows: Dynamic (based on month)
- Cell size: minmax(120px, 1fr)
- Gap: 1px (#E2E8F0 borders)

Event Card:
- Background: Color-coded by type
- Padding: 6px 8px
- Border-radius: 4px
- Font-size: 12px
- Max-lines: 2 with ellipsis
```

**Event Types:**

```
Published: #10B981 (Emerald)
Scheduled: #3B82F6 (Blue)
Draft: #94A3B8 (Slate)
Needs Review: #F59E0B (Amber)
```

**Component Structure:**

```tsx
<Calendar>
  <CalendarHeader>
    <MonthNavigation />
    <DateDisplay />
    <ViewToggle />
  </CalendarHeader>
  <CalendarGrid>
    <DayHeader>Mon</DayHeader>
    {/* ... more days */}
    <CalendarDay date={date}>
      <CalendarEvent type="scheduled" />
      <CalendarEvent type="draft" />
    </CalendarDay>
  </CalendarGrid>
</Calendar>
```

---

### 3. Article Cards

**Visual Characteristics:**

- White background with subtle border
- Title with truncation
- Metadata row (status, date, author)
- Action buttons on hover
- Status badge

**Card Dimensions:**

```
Card:
- Width: 100%
- Min-height: 120px
- Padding: 16px
- Border-radius: 8px
- Border: 1px solid #E2E8F0
- Shadow: 0 1px 3px rgba(0,0,0,0.05)
- Hover shadow: 0 4px 12px rgba(0,0,0,0.08)

Title:
- Font-size: 16px
- Font-weight: 600
- Line-height: 1.4
- Max-lines: 2 with ellipsis

Metadata:
- Font-size: 13px
- Color: #64748B
- Display: flex, gap 8px
- Separator: "•"
```

**Status Badges:**

```
Published:
- Background: #D1FAE5
- Text: #065F46
- Border: 1px solid #10B981

Draft:
- Background: #F1F5F9
- Text: #475569
- Border: 1px solid #CBD5E1

Scheduled:
- Background: #DBEAFE
- Text: #1E40AF
- Border: 1px solid #3B82F6
```

**Component Structure:**

```tsx
<ArticleCard>
  <CardHeader>
    <StatusBadge status="published" />
    <ArticleActions>
      <IconButton icon={Edit} />
      <IconButton icon={MoreVertical} />
    </ArticleActions>
  </CardHeader>
  <ArticleTitle>{title}</ArticleTitle>
  <ArticleMetadata>
    <span>{date}</span>
    <span>•</span>
    <span>{author}</span>
  </ArticleMetadata>
  <ArticlePreview>{excerpt}</ArticlePreview>
</ArticleCard>
```

---

### 4. Buttons

**Button Variants:**

**Primary Button:**

```
Default:
- Background: #4F46E5
- Text: #FFFFFF
- Border: none
- Border-radius: 6px
- Padding: 8px 16px
- Font-weight: 500
- Box-shadow: 0 1px 2px rgba(0,0,0,0.05)

Hover:
- Background: #4338CA
- Box-shadow: 0 4px 12px rgba(79,70,229,0.25)

Active:
- Background: #3730A3
- Transform: scale(0.98)

Disabled:
- Background: #E2E8F0
- Text: #94A3B8
- Cursor: not-allowed
```

**Secondary Button:**

```
Default:
- Background: #FFFFFF
- Text: #0F172A
- Border: 1px solid #E2E8F0
- Border-radius: 6px
- Padding: 8px 16px
- Font-weight: 500

Hover:
- Background: #F8FAFC
- Border-color: #CBD5E1

Active:
- Background: #F1F5F9
```

**Ghost Button:**

```
Default:
- Background: transparent
- Text: #475569
- Border: none
- Padding: 8px 16px

Hover:
- Background: #F1F5F9
- Text: #0F172A

Active:
- Background: #E2E8F0
```

**Icon Button:**

```
Dimensions:
- Size: 36px x 36px
- Border-radius: 6px

States:
- Default: transparent
- Hover: #F1F5F9
- Active: #E2E8F0
```

**Component Structure:**

```tsx
<Button variant="primary" size="medium">
  Create Article
</Button>

<Button variant="secondary" size="medium">
  Cancel
</Button>

<IconButton icon={Edit} aria-label="Edit" />
```

---

### 5. Input Fields

**Text Input:**

```
Default:
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border-radius: 6px
- Padding: 8px 12px
- Font-size: 14px
- Height: 36px
- Box-shadow: inset 0 1px 2px rgba(0,0,0,0.02)

Hover:
- Border-color: #CBD5E1

Focus:
- Border-color: #4F46E5
- Box-shadow: 0 0 0 3px rgba(79,70,229,0.1)
- Outline: none

Error:
- Border-color: #EF4444
- Box-shadow: 0 0 0 3px rgba(239,68,68,0.1)

Disabled:
- Background: #F8FAFC
- Border-color: #E2E8F0
- Color: #94A3B8
```

**With Addons:**

```
Left Icon/Text:
- Padding-left: 36px
- Icon position: absolute, left 12px

Right Icon/Text:
- Padding-right: 36px
- Icon position: absolute, right 12px

Both:
- Padding: 8px 36px
- Border-radius: 6px
```

**Textarea:**

```
- Min-height: 80px
- Padding: 10px 12px
- Resize: vertical
- Line-height: 1.5
```

**Component Structure:**

```tsx
<Input
  type="text"
  placeholder="Enter title..."
  leftAddon={<Search />}
/>

<Textarea
  placeholder="Write article content..."
  rows={6}
/>
```

---

### 6. Tables

**Table Structure:**

```
Table:
- Width: 100%
- Border-collapse: separate
- Border-spacing: 0
- Background: #FFFFFF

Header:
- Background: #F8FAFC
- Border-bottom: 1px solid #E2E8F0
- Padding: 12px 16px
- Font-weight: 600
- Font-size: 13px
- Text-transform: uppercase
- Letter-spacing: 0.05em
- Color: #64748B

Row:
- Border-bottom: 1px solid #F1F5F9
- Padding: 12px 16px
- Font-size: 14px
- Transition: background 150ms

Row Hover:
- Background: #F8FAFC

Row Selected:
- Background: #EEF2FF (Indigo-50)
```

**Cell Alignment:**

```
Text cells: left
Numeric cells: right
Action cells: center
Status cells: center
```

**Component Structure:**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Article Title</TableCell>
      <TableCell>
        <Badge>Published</Badge>
      </TableCell>
      <TableCell className="text-right">
        <ActionsDropdown />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### 7. Modals/Dialogs

**Overlay:**

```
- Background: rgba(0,0,0,0.5)
- Backdrop blur: 4px
- Animation: fadeIn 150ms
```

**Modal:**

```
Container:
- Background: #FFFFFF
- Border-radius: 12px
- Max-width: 560px
- Width: 90%
- Max-height: 90vh
- Box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)
- Animation: slideInUp 200ms

Header:
- Padding: 20px 24px
- Border-bottom: 1px solid #E2E8F0
- Font-size: 18px
- Font-weight: 600

Content:
- Padding: 24px
- Overflow-y: auto
- Max-height: calc(90vh - 140px)

Footer:
- Padding: 16px 24px
- Border-top: 1px solid #E2E8F0
- Display: flex
- Justify-content: flex-end
- Gap: 8px
```

**Component Structure:**

```tsx
<Modal>
  <ModalHeader>
    <ModalTitle>Create Article</ModalTitle>
    <ModalClose />
  </ModalHeader>
  <ModalContent>
    <Form />
  </ModalContent>
  <ModalFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Create</Button>
  </ModalFooter>
</Modal>
```

---

### 8. Badges & Tags

**Badge Styles:**

```
Default:
- Padding: 4px 10px
- Border-radius: 9999px (pill)
- Font-size: 12px
- Font-weight: 500
- Display: inline-flex
- Align-items: center
- Gap: 4px

Status Badges:
- Success: bg-emerald-100 text-emerald-700
- Warning: bg-amber-100 text-amber-700
- Error: bg-red-100 text-red-700
- Info: bg-blue-100 text-blue-700

With Icon:
- Padding-left: 6px
- Icon size: 14px
```

**Removable Tags:**

```
Tag:
- Background: #F1F5F9
- Color: #475569
- Border: 1px solid #E2E8F0
- Padding: 4px 8px
- Border-radius: 4px
- Font-size: 13px
- Gap: 6px

Remove Icon:
- Size: 14px
- Color: #64748B
- Hover: #EF4444
- Cursor: pointer
```

**Component Structure:**

```tsx
<Badge variant="success">Published</Badge>

<Tag removable onRemove={() => {}}>
  Content Marketing
</Tag>
```

---

### 9. Dropdown Menus

**Menu Structure:**

```
Container:
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border-radius: 8px
- Box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)
- Min-width: 180px
- Padding: 4px
- Animation: fadeIn 150ms

Menu Item:
- Padding: 8px 12px
- Border-radius: 4px
- Font-size: 14px
- Display: flex
- Align-items: center
- Gap: 8px
- Cursor: pointer

Menu Item Hover:
- Background: #F8FAFC

Menu Item Active:
- Background: #EEF2FF
- Color: #4F46E5

Divider:
- Height: 1px
- Background: #E2E8F0
- Margin: 4px 0
```

**Component Structure:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <IconButton icon={MoreVertical} />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem icon={Edit}>Edit</DropdownMenuItem>
    <DropdownMenuItem icon={Copy}>Duplicate</DropdownMenuItem>
    <DropdownMenuDivider />
    <DropdownMenuItem icon={Trash} variant="destructive">
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 10. Tabs

**Tab Styles:**

```
Tab List:
- Display: flex
- Gap: 0
- Border-bottom: 1px solid #E2E8F0

Tab:
- Padding: 10px 16px
- Font-size: 14px
- Font-weight: 500
- Color: #64748B
- Border-bottom: 2px solid transparent
- Cursor: pointer
- Transition: all 150ms

Tab Hover:
- Color: #0F172A
- Background: #F8FAFC

Tab Active:
- Color: #4F46E5
- Border-bottom-color: #4F46E5

Tab Disabled:
- Color: #CBD5E1
- Cursor: not-allowed
```

**Component Structure:**

```tsx
<Tabs defaultValue="drafts">
  <TabsList>
    <TabsTrigger value="drafts">Drafts</TabsTrigger>
    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
    <TabsTrigger value="published">Published</TabsTrigger>
  </TabsList>
  <TabsContent value="drafts">{/* Content */}</TabsContent>
</Tabs>
```

---

### 11. Search & Filter

**Search Bar:**

```
Container:
- Position: relative
- Max-width: 400px

Input:
- Width: 100%
- Height: 36px
- Padding: 8px 12px 8px 36px
- Border: 1px solid #E2E8F0
- Border-radius: 6px

Icon:
- Position: absolute
- Left: 10px
- Top: 50%
- Transform: translateY(-50%)
- Color: #94A3B8
- Size: 18px
```

**Filter Chips:**

```
Chip:
- Display: inline-flex
- Align-items: center
- Gap: 6px
- Padding: 6px 12px
- Border-radius: 6px
- Background: #F1F5F9
- Border: 1px solid #E2E8F0
- Font-size: 13px
- Cursor: pointer
- Transition: all 150ms

Chip Hover:
- Background: #E2E8F0

Chip Active:
- Background: #EEF2FF
- Border-color: #4F46E5
- Color: #4F46E5
```

**Component Structure:**

```tsx
<SearchBar>
  <SearchIcon />
  <Input placeholder="Search articles..." />
</SearchBar>

<FilterGroup>
  <FilterChip active>All</FilterChip>
  <FilterChip>Published</FilterChip>
  <FilterChip>Draft</FilterChip>
  <FilterChip>Scheduled</FilterChip>
</FilterGroup>
```

---

### 12. Notifications/Toasts

**Toast Container:**

```
Position: fixed
Top: 24px
Right: 24px
Z-index: 9999
Max-width: 400px
Display: flex
Flex-direction: column
Gap: 8px
```

**Toast:**

```
Container:
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border-radius: 8px
- Padding: 12px 16px
- Box-shadow: 0 4px 12px rgba(0,0,0,0.1)
- Display: flex
- Align-items: flex-start
- Gap: 12px
- Animation: slideInRight 200ms

Icon:
- Size: 20px

Success: #10B981
Error: #EF4444
Warning: #F59E0B
Info: #3B82F6

Content:
- Flex: 1

Title:
- Font-size: 14px
- Font-weight: 600
- Color: #0F172A
- Margin-bottom: 2px

Message:
- Font-size: 13px
- Color: #64748B
- Line-height: 1.4

Close Button:
- Size: 20px
- Color: #94A3B8
- Hover: #64748B
```

**Component Structure:**

```tsx
<Toast variant="success">
  <CheckCircleIcon />
  <div>
    <ToastTitle>Article Published</ToastTitle>
    <ToastMessage>Your article has been published successfully.</ToastMessage>
  </div>
  <ToastClose />
</Toast>
```

---

## Interactive States

### Hover States

**General Hover Behavior:**

- Transition duration: 150ms
- Timing function: ease-out
- Transform: translateY(-1px) for cards
- Box-shadow increase for depth

**Button Hover:**

```css
background-color: darken(5%);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**Card Hover:**

```css
border-color: #cbd5e1;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
transform: translateY(-2px);
```

**Menu Item Hover:**

```css
background-color: #f8fafc;
```

### Focus States

**Focus Ring:**

```css
outline: none;
box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
border-color: #4f46e5;
```

**Skip Links:**

- Visible on focus only
- Top-left positioning
- High contrast for accessibility

### Active States

**Button Active:**

```css
transform: scale(0.98);
background-color: darken(10%);
```

**Menu Item Active:**

```css
background-color: #eef2ff;
color: #4f46e5;
```

### Disabled States

**General Disabled:**

```css
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
```

**Button Disabled:**

```css
background-color: #e2e8f0;
color: #94a3b8;
```

### Loading States

**Button Loading:**

```css
position: relative;
color: transparent;
pointer-events: none;
```

**Spinner:**

```css
border: 2px solid #e2e8f0;
border-top-color: #4f46e5;
border-radius: 50%;
width: 16px;
height: 16px;
animation: spin 0.8s linear infinite;
```

**Skeleton Loading:**

```css
background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

### Error States

**Input Error:**

```css
border-color: #ef4444;
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
```

**Error Message:**

```css
color: #ef4444;
font-size: 13px;
margin-top: 4px;
display: flex;
align-items: center;
gap: 6px;
```

---

## Responsive Patterns

### Breakpoints

```
Mobile:      320px - 640px
Tablet:      641px - 1024px
Desktop:     1025px - 1440px
Wide:        1441px+
```

### Mobile Adaptations

**Sidebar:**

- Default: Hidden (off-canvas)
- Toggle: Hamburger menu in header
- Animation: Slide from left
- Overlay: Semi-transparent backdrop

**Tables:**

- Card view on mobile
- Each row becomes a card
- Vertical stacking of cells

**Grid Layouts:**

- Default: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Wide: 4 columns

**Buttons:**

- Full width on mobile
- Auto width on desktop

**Modals:**

- Width: 95% on mobile
- Width: 560px on desktop
- Bottom sheet on mobile (optional)

---

## Design Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-primary-active: #3730a3;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 18px;
  --text-2xl: 20px;
  --text-3xl: 24px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;

  /* Z-Index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

---

## Component API Reference

### Button Component

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### Input Component

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  helperText?: string;
  onChange?: (value: string) => void;
}
```

### Card Component

```tsx
interface CardProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  children: React.ReactNode;
}
```

### Badge Component

```tsx
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

---

## Best Practices

### 1. Component Composition

```tsx
// Good: Composable components
<Card>
  <CardHeader title="Article" actions={<Button>Edit</Button>} />
  <CardContent>
    <p>Article content...</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>

// Avoid: Monolithic components
<ArticleCard
  title="..."
  content="..."
  editButton={true}
  deleteButton={true}
  showFooter={true}
/>
```

### 2. Semantic HTML

```tsx
// Good: Semantic elements
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

// Avoid: Div soup
<div class="nav">
  <div class="nav-item">
    <div class="link">Dashboard</div>
  </div>
</div>
```

### 3. Accessibility

```tsx
// Always include:
- aria-label for icon-only buttons
- aria-disabled for disabled states
- role for interactive elements
- aria-expanded for dropdowns
- aria-current for active navigation items
- keyboard navigation support
- focus indicators
- sufficient color contrast (4.5:1 minimum)
```

### 4. Performance

```tsx
// Use memoization for expensive renders
const ArticleCard = React.memo(({ article }) => {
  // ...
});

// Lazy load heavy components
const Calendar = React.lazy(() => import('./Calendar'));

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Migration Guide: DevFlow to Outrank.so Style

### Color Mapping

```css
/* DevFlow Dark Theme -> Outrank.so */
--primary: oklch(0.55 0.25 265); /* Keep purple brand */
--background: #ffffff; /* Switch to white */
--card: #ffffff;
--border: #e2e8f0; /* Lighter borders */
```

### Component Updates

```tsx
// Sidebar: Keep glass morphism but lighter
<Sidebar className="bg-white/80 backdrop-blur-md border-r border-slate-200">

// Cards: Increase shadow, reduce gradient
<Card className="bg-white border border-slate-200 shadow-lg">

// Buttons: Simplify variants
<Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
```

---

## Conclusion

This documentation provides a comprehensive analysis of Outrank.so's UI components. Key takeaways:

1. **Clean, Minimal Design**: Lots of whitespace, subtle borders, strategic shadows
2. **Consistent Spacing**: 4px grid system throughout
3. **Clear Hierarchy**: Typography scale and color usage creates visual hierarchy
4. **Thoughtful Interactions**: Smooth transitions, clear states, accessible
5. **Modern Layouts**: Flexbox and CSS Grid with responsive breakpoints

Use this as a reference when implementing similar components in DevFlow, adapting the patterns to match your brand while maintaining the professional, polished aesthetic.
