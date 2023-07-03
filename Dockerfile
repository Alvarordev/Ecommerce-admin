# Utiliza una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . /app

# Instala las dependencias
RUN npm install

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Ejecuta el comando para iniciar la aplicación
CMD ["npm", "run", "dev"]