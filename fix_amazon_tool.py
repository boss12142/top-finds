import sys
lines = open(r'E:\Remotion2\Cinema Agent\core\amazon_tool.py', encoding='utf-8').readlines()
# Delete orphaned lines 79-109 (0-indexed: 78-108)
cleaned = lines[:78] + lines[109:]
open(r'E:\Remotion2\Cinema Agent\core\amazon_tool.py', 'w', encoding='utf-8').writelines(cleaned)
print(f'Done. Removed {690-len(cleaned)} lines. Total: {len(cleaned)}')
