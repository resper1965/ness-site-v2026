import os
import re

routes_dir = '/home/resper/ness-site2026/canal/admin/src/routes'
files = [f for f in os.listdir(routes_dir) if f.endswith('.tsx')]

for filename in files:
    if filename in ['dashboard.tsx', 'dashboard-home.tsx', 'collection.css', 'login.tsx']:
        continue
    filepath = os.path.join(routes_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Force the main wrapper to be responsive and not stretch infinitely
    # Looking for <div className="... flex-1 space-y-6 p-8
    content = re.sub(
        r'className="([^"]*(?:flex-1|animate-in)[^"]* p-8[^"]*)"',
        r'className="\1 mx-auto max-w-7xl w-full flex-1 overflow-hidden min-w-0"',
        content
    )
    
    # 2. Fix the flex overflow to avoid infinite table stretching
    content = re.sub(
        r'className="([^"]*overflow-auto[^"]*)"',
        r'className="\1 min-w-0 max-w-full custom-scrollbar"',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)
print("Finished rewriting routes constraints.")
