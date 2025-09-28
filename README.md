# Spring Boot CRUD Application with Embedded PostgreSQL

This is a simple Spring Boot application that demonstrates CRUD (Create, Read, Update, Delete) operations using Spring Data JPA and an embedded PostgreSQL database.

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- PostgreSQL (if not using the embedded database)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spring-boot-crud-app
   ```

2. **Build the application**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080`.

## API Endpoints

### Products

- **Get all products**
  ```
  GET /products
  ```

- **Get product by ID**
  ```
  GET /productById/{id}
  ```

- **Add a new product**
  ```
  POST /addProduct
  Content-Type: application/json
  
  {
    "name": "Sample Product",
    "price": 19.99
  }
  ```

- **Add multiple products**
  ```
  POST /addProducts
  Content-Type: application/json
  
  [
    {
      "name": "Product 1",
      "price": 10.99
    },
    {
      "name": "Product 2",
      "price": 20.99
    }
  ]
  ```
  

- **Update a product**
  ```
  PUT /update
  Content-Type: application/json
  
  {
    "id": 1,
    "name": "Updated Product",
    "price": 25.99
  }
  ```

- **Delete a product**
  ```
  DELETE /delete/{id}
  ```

## Database Configuration

The application is configured to use an embedded PostgreSQL database by default. The database configuration can be modified in the `src/main/resources/application.properties` file.

## Testing

To run the tests, use the following command:

```bash
mvn test
```

## Built With

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL](https://www.postgresql.org/)
- [Maven](https://maven.apache.org/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
