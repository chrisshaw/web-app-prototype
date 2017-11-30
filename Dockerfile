FROM node:latest
ADD package.json .
ADD package-lock.json .
RUN npm install yarn
RUN yarn install
ADD . .
EXPOSE 8080
CMD ["npm","start"]