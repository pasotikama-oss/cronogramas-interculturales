import os
import subprocess

# Colors from uploaded images
DARK_BG = "#1e2430"
YELLOW = "#fed800"
WHITE = "#ffffff"

# 1. Logo 1: The Biz Nation Horizontal Banner (from logo_1.jpeg)
# ViewBox 900 x 280
svg_banner = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 280" width="920" height="280">
  <rect width="920" height="280" rx="16" fill="{DARK_BG}"/>
  
  <!-- Bulb Icon Group (left) -->
  <g transform="translate(130, 140)">
    <!-- Top Rays: center is square, left and right are tilted 45 deg diamonds -->
    <rect x="-16" y="-115" width="32" height="32" fill="{YELLOW}" rx="2"/>
    <rect x="-85" y="-95" width="30" height="30" fill="{YELLOW}" rx="2" transform="rotate(45, -70, -80)"/>
    <rect x="55" y="-95" width="30" height="30" fill="{YELLOW}" rx="2" transform="rotate(45, 70, -80)"/>

    <!-- Bulb Ring Head -->
    <path d="M 0 -68
             A 58 58 0 1 1 -24 38
             L -24 55
             L 24 55
             L 24 38
             A 58 58 0 0 1 0 -68 Z"
          fill="{YELLOW}" fill-rule="evenodd"/>
    
    <!-- Bulb Ring Inner Hollow -->
    <circle cx="0" cy="-10" r="35" fill="{DARK_BG}"/>

    <!-- Bulb Neck separator/cutout -->
    <rect x="-18" y="50" width="36" height="5" fill="{DARK_BG}"/>

    <!-- Base Z-screw -->
    <g transform="translate(-24, 60)">
      <!-- Top bar -->
      <rect x="0" y="0" width="48" height="13" fill="{YELLOW}" rx="1"/>
      <!-- Diagonal -->
      <polygon points="48,13 48,22 14,40 0,40 0,31 34,13" fill="{YELLOW}"/>
      <!-- Bottom bar -->
      <rect x="0" y="37" width="48" height="13" fill="{YELLOW}" rx="1"/>
    </g>
  </g>

  <!-- Text "Biz Nation" -->
  <g transform="translate(235, 172)">
    <text font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', 'Segoe UI', system-ui, sans-serif" 
          font-weight="800" 
          font-size="112" 
          letter-spacing="-1.5" 
          fill="{WHITE}">
      Biz Nation
    </text>
  </g>
</svg>
'''

# 2. Logo 2: The Yellow Vertical Emblem (from logo_2.jpeg)
# ViewBox 600 x 800
svg_emblem = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <!-- Yellow Background -->
  <rect width="600" height="800" rx="28" fill="{YELLOW}"/>

  <!-- Dark Icon in Center -->
  <g transform="translate(300, 420)">
    <!-- Top Center Square Ray -->
    <rect x="-35" y="-310" width="70" height="70" fill="{DARK_BG}" rx="4"/>

    <!-- Left Tilted Diamond Ray -->
    <rect x="-225" y="-260" width="66" height="66" fill="{DARK_BG}" rx="4" transform="rotate(45, -192, -227)"/>

    <!-- Right Tilted Diamond Ray -->
    <rect x="125" y="-260" width="66" height="66" fill="{DARK_BG}" rx="4" transform="rotate(45, 158, -227)"/>

    <!-- Bulb Ring Head -->
    <path d="M 0 -170
             A 160 160 0 1 1 -64 124
             L -64 165
             L 64 165
             L 64 124
             A 160 160 0 0 1 0 -170 Z"
          fill="{DARK_BG}" fill-rule="evenodd"/>
    
    <!-- Bulb Ring Inner Hollow -->
    <circle cx="0" cy="-10" r="96" fill="{YELLOW}"/>

    <!-- Base Z-screw / N -->
    <g transform="translate(-64, 195)">
      <!-- Top bar -->
      <rect x="0" y="0" width="128" height="34" fill="{DARK_BG}" rx="2"/>
      <!-- Diagonal -->
      <polygon points="128,34 128,58 38,110 0,110 0,86 90,34" fill="{DARK_BG}"/>
      <!-- Bottom bar -->
      <rect x="0" y="104" width="128" height="34" fill="{DARK_BG}" rx="2"/>
    </g>
  </g>
</svg>
'''

# 3. Transparent version of Banner for navbar/print headers
svg_banner_transparent = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 280" width="920" height="280">
  <!-- Bulb Icon Group (left) -->
  <g transform="translate(130, 140)">
    <!-- Top Rays -->
    <rect x="-16" y="-115" width="32" height="32" fill="{YELLOW}" rx="2"/>
    <rect x="-85" y="-95" width="30" height="30" fill="{YELLOW}" rx="2" transform="rotate(45, -70, -80)"/>
    <rect x="55" y="-95" width="30" height="30" fill="{YELLOW}" rx="2" transform="rotate(45, 70, -80)"/>

    <!-- Bulb Ring Head -->
    <path d="M 0 -68
             A 58 58 0 1 1 -24 38
             L -24 55
             L 24 55
             L 24 38
             A 58 58 0 0 1 0 -68 Z"
          fill="{YELLOW}" fill-rule="evenodd"/>
    
    <!-- Bulb Ring Inner Hollow (transparent cutout) -->
    <mask id="inner-hollow">
      <rect x="-100" y="-100" width="200" height="200" fill="white"/>
      <circle cx="0" cy="-10" r="35" fill="black"/>
      <rect x="-18" y="50" width="36" height="5" fill="black"/>
    </mask>

    <!-- Base Z-screw -->
    <g transform="translate(-24, 60)">
      <rect x="0" y="0" width="48" height="13" fill="{YELLOW}" rx="1"/>
      <polygon points="48,13 48,22 14,40 0,40 0,31 34,13" fill="{YELLOW}"/>
      <rect x="0" y="37" width="48" height="13" fill="{YELLOW}" rx="1"/>
    </g>
  </g>

  <!-- Text "Biz Nation" -->
  <g transform="translate(235, 172)">
    <text font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', 'Segoe UI', system-ui, sans-serif" 
          font-weight="800" 
          font-size="112" 
          letter-spacing="-1.5" 
          fill="{WHITE}">
      Biz Nation
    </text>
  </g>
</svg>
'''

os.makedirs('public', exist_ok=True)

with open('public/logo_biz_nation_banner.svg', 'w') as f:
    f.write(svg_banner)

with open('public/logo_biz_nation_emblem.svg', 'w') as f:
    f.write(svg_emblem)

with open('public/logo1.svg', 'w') as f:
    f.write(svg_banner)

with open('public/logo2.svg', 'w') as f:
    f.write(svg_emblem)

# Convert to PNG for maximum cross-device image compatibility
subprocess.run(['convert', '-density', '150', 'public/logo1.svg', 'public/logo1.png'])
subprocess.run(['convert', '-density', '150', 'public/logo2.svg', 'public/logo2.png'])
subprocess.run(['convert', '-density', '150', 'public/logo_biz_nation_banner.svg', 'public/logo_biz_nation_banner.png'])
subprocess.run(['convert', '-density', '150', 'public/logo_biz_nation_emblem.svg', 'public/logo_biz_nation_emblem.png'])

print("Logos successfully created in /public!")
