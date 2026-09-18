# ParqueoÁgil — Backend solo Business

Backend NestJS + Sequelize + Clean Architecture por feature, para el sistema de gestión de parqueadero **ParqueoÁgil**.

Proyecto de la materia **Desarrollo Web y Base de Datos II** (Uniguajira · 2026-II), basado en el proyecto guía StoreLab, adaptado al dominio de parqueadero.

## Stack

- **NestJS 12** (ESM, `module: nodenext`)
- **Sequelize + sequelize-typescript** (ORM multi-motor)
- **MySQL** como motor activo (también soporta PostgreSQL, SQL Server, Oracle)
- **class-validator** + **class-transformer** (validación)
- **Swagger** en `/api/docs`
- **vitest** para pruebas
- **oxlint** para linting

## Requisitos

- Node.js ≥ 20
- npm ≥ 10
- Docker (para levantar el contenedor MySQL)
- MySQL accesible en `localhost:3306`
