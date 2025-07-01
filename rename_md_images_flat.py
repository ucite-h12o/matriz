
import os
import re
import shutil

# === CONFIG ===
docs_dir = "docs"
media_dir = os.path.join(docs_dir, "media")
output_media_dir = "matriz/media"

os.makedirs(output_media_dir, exist_ok=True)

# === Step 1: Find all .md files ===
md_files = [f for f in os.listdir(docs_dir) if f.endswith(".md")]

for md_file in md_files:
    prefix = md_file.replace(".md", "")  # e.g., "proceso_lambda"
    md_path = os.path.join(docs_dir, md_file)

    # === Step 2: Build image map and copy files to output directory ===
    image_map = {}
    for filename in os.listdir(media_dir):
        if re.match(r'image\d+\.(jpg|jpeg|png|gif)', filename, re.IGNORECASE):
            ext = filename.split('.')[-1]
            number = re.findall(r'\d+', filename)[0]
            new_name = f"{prefix}_image{number}.{ext}"

            old_path = os.path.join(media_dir, filename)
            new_path = os.path.join(output_media_dir, new_name)

            # Move or copy the file
            shutil.move(old_path, new_path)
            image_map[filename] = f"/matriz/media/{new_name}"

    # === Step 3: Update Markdown file references ===
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    for old, new in image_map.items():
        content = content.replace(old, new)

    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ Processed {md_file}")

print("🎉 All Markdown files updated with renamed and relocated images.")
