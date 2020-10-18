# Stage 1
FROM node:12.18-alpine AS react-build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.17.1-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
