# 📋 SKKG One Page Report (OPR) Generator
> **The Sapphire Registry**: A sleek, offline-first, print-optimized tool for Sekolah Kebangsaan Kubang Gajah (SKKG), Perlis, Malaysia.

---

## 🌟 Overview

The **SKKG One Page Report (OPR) Generator** is a tailored, browser-based administrative utility designed specifically for the educators and administrative staff of **Sekolah Kebangsaan Kubang Gajah (SKKG)**. 

It provides an intuitive interface that streamlines the process of compiling and formatting standard school activity/program reports. Instead of grappling with misaligned Word documents or bloated reporting templates, users can input details, upload activity photos, and instantly generate a beautifully formatted, standardized **A4 single-page report** ready to print or save as a PDF.

---

## 🎯 Target Audience ("Who Will Use It?")

This utility is designed for:
- 🏫 **School Teachers**: To quickly document weekly activities, co-curricular events, and classroom programs.
- 📂 **Administrative Staff**: To archive school-wide programs in a clean, unified format.
- 🎓 **School Leadership (HM/PKs)**: To review clean, single-page, high-density executive summaries of school progress.

---

## ❓ The "Why" & "What"

### Why does this project exist?
1. **Time Constraints**: School staff operate under tight timelines and need to submit activity reports immediately after program execution.
2. **Layout Standardization**: Creating reports in standard word processors often leads to layout shifts, text overflows, and inconsistent formatting. The OPR Generator guarantees that every report fits **exactly on one A4 page**.
3. **Connectivity Challenges**: Traditional SaaS reporting tools require internet access. This tool is built **offline-first**, meaning it runs directly off the computer's hard drive without needing internet access or database setups.

### What is it?
An offline-first, browser-based wizard that collects program information (metadata, objectives, impacts, challenges), formats the layout according to a strict design guide, and renders a standard report sheet with automated time duration calculations and structured photo placements.

---

## 🚀 Key Features

*   **📋 3-Step Stepper Wizard**: A structured form wizard that guides users sequentially through *Metadata Entry*, *Report Content*, and *Evidence Photo Upload*.
*   **⏱️ Auto Duration Calculation**: Automatically calculates the exact hours and minutes elapsed between the start time and end time.
*   **📸 Smart Drag-&-Drop Photo Grid**: Supports dragging and dropping up to 3 photographs, rendering them in a grid that adapts dynamically to the number of images uploaded (1, 2, or 3).
*   **✏️ Inline Editable Captions**: Once rendered in the preview, users can click on photo captions directly on the document sheet to customize descriptions before printing.
*   **🖨️ Print-First Engine**: Utilizes custom `@media print` styling to optimize paper margins, suppress browser headers/footers, and prevent text spilling over to a second page.
*   **⚡ Zero-Network CORS Solution**: Employs Base64-encoded school logos to bypass local browser CORS restrictions, allowing the app to run completely from a `file://` local file pathway.

---

## 🛠️ Tech Stack

The application is engineered strictly with native web technologies to ensure zero setup overhead:

| Technology | Role | Details |
| :--- | :--- | :--- |
| **HTML5** | Structure & Semantics | Clean, semantic layouts with accessibility (aria-describedby) and SEO tags. |
| **CSS3** | Aesthetics & Layouts | Custom design variables, CSS Flexbox/Grid, and printer-specific print queries. |
| **JavaScript** | Logical Operations | ES6 Modules, drag-and-drop file readers, and dynamic DOM rendering. |
| **Base64** | Asset Embedding | Local file image-encoding to allow offline file execution bypassing CORS limitations. |

---

## 📐 Design Philosophy: "The Sapphire Registry"

The visual theme, named **"The Sapphire Registry"**, is built for school administration trust and print quality:
*   **Palette**: Anchored on **Executive Navy** (`#0f4c81`) and **Slate Slate** (`#334155`) for crisp reading contrast.
*   **Typography**: Clean sans-serif fonts (**Plus Jakarta Sans** for headers, **Inter** for readable body text).
*   **Print-Safe**: High-contrast, clean layout. No heavy dark background washes or solid color fills that drain printer ink.
*   **Flat Elevation**: Depth is conveyed strictly through thin hairlines (`#e2e8f0`) to replicate an official physical record ledger.

---

## 📁 Project Structure

```
opr-sk-kubang-gajah/
├── index.html            # Main HTML document & Stepper layout shell
├── README.md             # Project documentation (this file)
├── assets/
│   ├── logo.jpg          # Physical school logo image
│   └── logo-b64.js       # Base64 string version of the logo for offline rendering
├── css/
│   ├── tokens.css        # Core styling tokens (Colors, Typography, Spacing)
│   ├── form.css          # Form elements, layout grid, and Wizard stepper styles
│   ├── opr.css           # Preview sheet rendering layout styles
│   └── print.css         # Strict paper print-layout overrides for A4 sizing
└── js/
    ├── form.js           # Stepper flow, validation, and auto-duration calculation
    ├── photos.js         # File drag-and-drop processing and thumbnails
    ├── render.js         # OPR template compiler and HTML renderer
    └── print.js          # Independent print-window launch logic
```

---

## 📖 How to Run & Use the App

### 1. Launching the App
1. Download or clone the folder `opr-sk-kubang-gajah` to your computer.
2. Locate `index.html` and **double-click** to open it in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. *Note on ES6 Modules*: Because this app uses native ES Modules (`type="module"`), some modern browsers block module loading when run locally via `file://`. If the form fails to advance or operate:
   - Run a quick local HTTP server using Python:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`.
   - Or, open it with VS Code's **Live Server** extension.

### 2. Filling Out a Report
- **Step 1 (Maklumat)**: Enter the activity name, date, time, location, presenter, and target audience. The duration will update automatically.
- **Step 2 (Kandungan)**: Describe the objectives, program impacts, weaknesses/improvements, and notes. (Character counts enforce concise summaries to prevent page overflow).
- **Step 3 (Gambar)**: Drag and drop up to 3 photos of the event.
- Click **"Jana OPR"** to compile the preview.
- In the preview screen, you can click on the caption text underneath any photo to customize the text inline.

### 3. Printing or Saving as PDF
1. Click **"Cetak / Simpan PDF"** in the preview view.
2. In the browser Print Dialog:
   - **Destination**: Choose your physical printer or select **"Save as PDF"**.
   - **Paper Size**: **A4**.
   - **Layout**: **Portrait**.
   - **Margins**: Select **"None"** or **"Default"**.
   - **Options**: Ensure **"Background graphics"** is **checked** (to display header bars and colors).
   - **Headers & Footers**: **Uncheck** (to hide browser URL and page numbers).
3. Click **Print** or **Save**.

---

## 🔧 Configuring the School Logo

To ensure the school logo renders correctly in offline environments without triggering CORS issues, the logo is converted into a **Base64 string** stored in `assets/logo-b64.js`.

To update the school logo:
1. Open the application (`index.html`) in your browser.
2. Open **Developer Console** (Press `F12` or right-click anywhere > `Inspect` > select the `Console` tab).
3. Copy and run the following script inside the console:
   ```javascript
   (function() {
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = 'image/*';
     input.onchange = e => {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.onload = evt => console.log(evt.target.result);
       reader.readAsDataURL(file);
     };
     input.click();
   })();
   ```
4. A file picker will appear. Select your school logo image (PNG or JPG).
5. The console will print a very long text string starting with `data:image/png;base64,...` (or `data:image/jpeg;base64,...`).
6. Copy that entire string, open `assets/logo-b64.js` in a text editor, and paste it into the `LOGO_B64` variable:
   ```javascript
   export const LOGO_B64 = "PASTE_THE_BASE64_STRING_HERE";
   ```
7. Save the file. The logo will now render perfectly on your reports.
