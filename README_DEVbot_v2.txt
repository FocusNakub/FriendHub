FriendHub DevBot v2

สิ่งที่ต้องอัปโหลด:
1. อัปโหลด `.github/workflows/discord.yml` ทับไฟล์เดิม
2. ตรวจว่า Repo มี `project.json` อยู่แล้ว
3. ใน `project.json` ควรมีค่า:
   - game
   - website
   - version
   - status
   - progress
   - statusItems
   - patchNotes

ถ้าอยากทดสอบ:
- แก้ progress ใน project.json เช่น 65 -> 66
- Commit changes
- Discord ควรส่ง Embed แบบใหม่พร้อม Version / Progress / Patch Notes
