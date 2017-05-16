FROM node

WORKDIR /shingo-website

RUN mkdir -p logs && touch logs/website.log

RUN npm install

RUN npm install -g nodemon

ENV PORT=80

ENV NODE_ENV=development

EXPOSE 80

ENTRYPOINT nodemon app.js