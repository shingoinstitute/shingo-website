FROM node:8.9-alpine
ENV NODE_ENV production
ENV PORT=80
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
EXPOSE 80
CMD npm start
