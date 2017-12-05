FROM node:latest
ADD package.json .
ADD package-lock.json .
# Install Yarn repository
RUN curl -sS http://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install OS dependencies
RUN apt-get update
RUN apt-get install yarn

# Install Node dependencies
RUN yarn install
ADD . .
EXPOSE 8080
CMD ["yarn","start"]