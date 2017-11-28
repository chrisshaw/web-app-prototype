FROM node:latest
ADD package.json .
ADD package-lock.json .
RUN npm install yarn
ADD yarn.lock .
RUN yarn install
ADD . .
EXPOSE 8080
CMD ["npm","start"]