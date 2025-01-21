import swaggerJSDoc from "swagger-jsdoc";


const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Huntcash API Documentation',
        version: '1.0.0',
        description: 'API documentation for Huntcash',
      },
      servers: [
        {
          url: 'https://temp.earnrupi.com', // Replace with your server URL
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to your API documentation files
  };
  
  const swaggerSpecs = swaggerJSDoc(swaggerOptions);

  export default swaggerSpecs;
