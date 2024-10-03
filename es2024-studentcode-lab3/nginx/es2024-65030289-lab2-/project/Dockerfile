# ใช้ Nginx official image
FROM nginx:latest

# คัดลอกไฟล์ HTML และโฟลเดอร์ css และ js ไปยัง Nginx directory
COPY ./html /usr/share/nginx/html
COPY ./css /usr/share/nginx/html/css
COPY ./js /usr/share/nginx/html/js

FROM nginx:alpine
COPY html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
