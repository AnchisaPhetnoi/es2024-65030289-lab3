# ใช้ Node.js official image
FROM node:16

# ตั้งค่า working directory ใน container
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . .

# ระบุ port ที่จะ expose (ในกรณีนี้คือ 3000)
EXPOSE 3000

# รันคำสั่งเพื่อเริ่มต้นแอปพลิเคชัน
CMD ["node", "index.js"]
