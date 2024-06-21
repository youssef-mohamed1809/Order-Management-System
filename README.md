
## Installation

- Download and Install Node and NPM

- Download the project

```bash
git clone https://github.com/youssef-mohamed1809/Order-Management-System.git
cd Order-Management-System
```
- Install the required modules
```bash
npm install
```

- Download and Install PostgreSQL locally

- Create a PostgreSQL called "OrderManagement"

- Create a .env file in the root directory of the project and add the following line then replace the USERNAME and PASSWORD with your credentials

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/OrderManagement"
```

- Run the following command to create the PostgreSQL tables using prisma
```bash
    npx prisma migrate dev --name initial_migration
```

- Run the code using the following command
```
npm run start
```
