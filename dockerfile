FROM node:lts-alpine

ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_PORT=5050
ENV DATABASE_NAME=smartcalendar
ENV DATABASE_USER=root
ENV DATABASE_PASSWORD=Flipper184!

WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8080
RUN chown -R node /usr/src/app
USER node
CMD ["node", "src/Server.js"]
