FROM node:latest

WORKDIR /code
COPY ./ /code
RUN npm install --no-progress --ignore-optional

EXPOSE 8080
CMD npm run serve

