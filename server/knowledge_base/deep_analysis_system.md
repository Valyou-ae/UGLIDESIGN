# Stage 1: Deep Analysis System

**Stage Number:** 1  
**Status:** IMPLEMENTED  
**Purpose:** Automated prompt analysis and intelligent component selection

---

## 📋 Overview

An AI-powered system that analyzes user prompts to detect subject, mood, lighting, environment, and automatically selects optimal styles and cinematic components. This is the "brain" that guides the other agents.

---

## 🎯 Analysis Components

The Deep Analysis System consists of 4 major detection modules that feed into the Style Architect agent:

### 1. Subject Detection
### 2. Mood Detection
### 3. Lighting Scenario Detection
### 4. Environment Detection

---

## 1️⃣ Subject Detection

**Purpose:** Identify what the image is about to apply the correct compositional rules and negative prompts.

### Subject Categories

- **People:** `portrait`, `full body`, `group`, `crowd`, `candid`  
  *Triggers negative prompts for hands, faces, anatomy.*
- **Landscape:** `mountain`, `ocean`, `forest`, `desert`, `urban`, `rural`  
  *Triggers negative prompts for composition, color.*
- **Product:** `tech`, `fashion`, `food`, `luxury`, `everyday`  
  *Triggers negative prompts for lighting, background clutter.*
- **Architecture:** `modern`, `historic`, `interior`, `exterior`  
  *Triggers negative prompts for perspective and lines.*
- **Action:** `sports`, `dance`, `combat`, `movement`  
  *Triggers negative prompts for motion blur and awkward poses.*
- **Wildlife:** `mammals`, `birds`, `marine`, `insects`  
  *Triggers negative prompts for animal anatomy.*

### Detection Algorithm
A lightweight Gemini Flash Lite model is prompted with the user's input and a strict JSON schema to categorize the primary subject. This structured data is then used by the Style Architect.

---

## 2️⃣ Mood Detection

**Purpose:** Identify the emotional tone to guide color grading and lighting choices.

### Mood Categories & Influence

- **Happy:** `joyful`, `bright`, `sunny` → Leads to warm, saturated colors and soft lighting.
- **Dramatic:** `intense`, `powerful`, `striking` → Leads to high-contrast palettes and lighting (e.g., Rembrandt).
- **Mysterious:** `enigmatic`, `secret`, `dark` → Leads to muted, cool tones and low-key lighting.
- **Romantic:** `soft`, `dreamy`, `intimate` → Leads to warm pastels and glowing light.
- **Melancholic:** `sad`, `nostalgic`, `somber` → Leads to cool, desaturated colors and overcast lighting.
- **Energetic:** `dynamic`, `vibrant`, `active` → Leads to saturated, bold, contrasting colors.
- **Peaceful:** `calm`, `serene`, `tranquil` → Leads to soft, harmonious, natural colors and even lighting.
- **Epic:** `grand`, `heroic`, `majestic` → Leads to rich, saturated colors and dramatic, directional light.
- **Horror:** `scary`, `unsettling`, `ominous` → Leads to dark, desaturated palettes and harsh, unsettling light.
- **Nostalgic:** `vintage`, `retro`, `memories` → Leads to faded, warm tones and soft, diffused light.

### Mood Detection Algorithm
Similar to subject detection, a Gemini Flash Lite model analyzes the prompt for keywords related to these moods, returning a primary mood that heavily influences the Style Architect's lighting and color grading choices.

---

## 3️⃣ Lighting Scenario Detection

**Purpose:** Identify the lighting situation to select the correct cinematic lighting setup.

### Lighting Scenarios & Agent Response

- **Natural Daylight:** Bright, clear, natural → Agent selects a natural light setup with a subtle fill light.
- **Golden Hour:** `sunset`, `sunrise`, `magic hour` → Agent selects warm, directional lighting and enhances atmospheric effects.
- **Blue Hour:** `twilight`, `dusk` → Agent selects cool, soft, balanced lighting and suggests a cool color grade.
- **Night:** `dark`, `evening` → Agent emphasizes practical (in-scene) light sources and adds atmospheric fog.
- **Studio:** `professional`, `white background` → Agent defaults to a professional three-point lighting setup.
- **Low Light:** `dim`, `moody` → Agent selects dramatic low-key lighting (chiaroscuro) and adds atmospheric haze.
- **Overcast:** `cloudy`, `diffused` → Agent uses soft, even, natural light with minimal shadows.
- **Backlit:** `silhouette`, `rim light` → Agent emphasizes backlight and adds fill light to the front.

---

## 4️⃣ Environment Detection

**Purpose:** Identify the location to apply appropriate atmospheric effects.

### Environment Types & Agent Response

- **Indoor:** `room`, `inside` → Agent adds subtle dust particles in light shafts and volumetric light from windows/lamps.
- **Outdoor:** `outside`, `exterior` → Agent adds natural atmospheric haze that increases with distance and potential for god rays.
- **Urban:** `city`, `street` → Combines outdoor effects with reflections from wet surfaces (if applicable).
- **Nature:** `forest`, `mountain`, `ocean` → Stronger emphasis on atmospheric perspective, fog, and natural light scattering.

---

## 🎯 Integration with Downstream Agents

### With Style Knowledge Base
The analysis system is the primary input for the "Auto" style selection. The Style Architect uses the detected subject, mood, and environment to choose the most appropriate style(s) from the 190+ entry library. For example, a prompt for a "sad portrait in a city at night" might cause the agent to select a blend of `Photorealistic`, `Cinematic`, and `Soulsborne Aesthetic` for a gritty, moody result.

### With Cinematic DNA System
The analysis directly triggers specific Cinematic DNA components:
- **Subject** → Dictates the **Composition Rule** (e.g., Portrait → Rule of Thirds).
- **Mood & Lighting** → Dictates the **Lighting System** and **Color Grade**.
- **Environment** → Dictates the **Atmospheric Effects**.
- **Subject (e.g., person, animal)** → Dictates the **Material Rendering** (e.g., adding Subsurface Scattering for skin).

---

## 📊 Expected Outcomes

### Without Deep Analysis
- Agents rely on generic enhancements.
- Style selection is random or based on simple keywords.
- Quality is inconsistent and often misses the user's intent.

### With Deep Analysis
- Enhancements are context-aware and specific.
- Style selection is intelligent and synergistic.
- Quality is consistently higher and more aligned with the prompt's nuances.
- The final image feels more intentional and professionally directed.

**Quality Improvement:** This stage is foundational. It enables the other agents to perform optimally, contributing significantly to the overall 50-60% quality boost.

---
*Stage 1: Deep Analysis System*  
*Intelligent Prompt Analysis & Component Selection*  
*Production Ready | AI-Powered*