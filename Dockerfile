FROM node:26-alpine AS builder
WORKDIR /app
COPY package.*json ./
RUN npm install

COPY . .
ARG API_BASE_URL='http://localhost:8080/api/v1'
ENV VITE_API_BASE_URL=$API_BASE_URL
ENV VITE_DEFAULT_FETCH_PAGE_SIZE=20
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY nginx.conf /etc/nginx/nginx.conf
#RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]