# Backend Documentation Prompts

## Architecture Documentation Prompts

### Express.js Architecture
```
Prompt: Help me document the architecture of a Node.js/Express.js inventory management system with:
- Authentication using JWT
- Role-based access control
- RESTful API endpoints
- PostgreSQL database
- Error handling middleware
- Input validation
- File upload handling

Please include:
1. Directory structure
2. Middleware organization
3. Service layer pattern
4. Database models
5. Authentication flow
6. Error handling strategy
```

### Database Schema
```
Prompt: Document the PostgreSQL database schema for an inventory management system including:
1. Table relationships
2. Foreign key constraints
3. Indexes
4. Triggers
5. Views

Focus on these entities:
- Users and roles
- Products and categories
- Stock and warehouses
- Purchase orders
- Stock movements
- Audit logs
```

### API Documentation
```
Prompt: Generate comprehensive API documentation for an inventory management system including:
1. Authentication endpoints
2. Product management
3. Stock operations
4. Purchase orders
5. Reports generation

For each endpoint, include:
- URL and method
- Request parameters
- Request body schema
- Response format
- Error responses
- Authentication requirements
- Example requests and responses
```

## Function-Level Documentation Prompts

### Authentication Service
```
Prompt: Create detailed function-level documentation for the authentication service including:
1. Login function
2. Token generation
3. Token verification
4. Password hashing
5. Role verification

Include for each function:
- Parameters
- Return types
- Error handling
- Usage examples
- Security considerations
```

### Inventory Service
```
Prompt: Document the inventory service functions including:
1. Stock management
2. Movement tracking
3. Stock adjustments
4. Warehouse operations
5. Stock level alerts

For each function, detail:
- Business logic
- Database operations
- Validation rules
- Transaction handling
- Error scenarios
```

### Report Service
```
Prompt: Generate documentation for the reporting service including:
1. Analytics generation
2. Data aggregation
3. Export functionality
4. Custom report building
5. Scheduled reports

Detail:
- Query optimization
- Data formatting
- File generation
- Caching strategy
- Error handling
```

## Testing Documentation Prompts

### Unit Tests
```
Prompt: Create documentation for the unit test suite including:
1. Test structure
2. Mocking strategies
3. Database testing
4. Authentication testing
5. Error case testing

Include:
- Test setup
- Mock data
- Common patterns
- Best practices
- Coverage requirements
```

### Integration Tests
```
Prompt: Document the integration test strategy for:
1. API endpoints
2. Database operations
3. Authentication flow
4. Business logic
5. Error handling

Detail:
- Test environment setup
- Data seeding
- Test scenarios
- Cleanup procedures
- CI/CD integration
```

## Deployment Documentation Prompts

### Production Setup
```
Prompt: Generate deployment documentation including:
1. Environment setup
2. Database configuration
3. Security measures
4. Logging setup
5. Monitoring

Cover:
- Environment variables
- Security best practices
- Performance optimization
- Backup strategies
- Scaling considerations
```

### CI/CD Pipeline
```
Prompt: Document the CI/CD pipeline setup including:
1. Build process
2. Test automation
3. Deployment stages
4. Rollback procedures
5. Monitoring

Detail:
- Pipeline configuration
- Environment management
- Quality gates
- Deployment verification
- Monitoring setup
```

## Development Process Documentation Prompts

### Code Standards
```
Prompt: Create documentation for backend code standards including:
1. File organization
2. Naming conventions
3. Error handling patterns
4. Logging standards
5. Comment requirements

Include:
- Directory structure
- File naming
- Code formatting
- Documentation requirements
- Review process
```

### Development Workflow
```
Prompt: Document the development workflow including:
1. Branch strategy
2. Commit conventions
3. Review process
4. Testing requirements
5. Release process

Detail:
- Git workflow
- Code review checklist
- Testing requirements
- Documentation updates
- Release procedures
```

## Performance Documentation Prompts

### Optimization Strategies
```
Prompt: Document performance optimization strategies for:
1. Database queries
2. API responses
3. Authentication
4. File operations
5. Background jobs

Include:
- Query optimization
- Caching strategies
- Connection pooling
- Load balancing
- Monitoring metrics
```

### Scaling Guide
```
Prompt: Create documentation for scaling considerations including:
1. Horizontal scaling
2. Vertical scaling
3. Database scaling
4. Cache scaling
5. Load balancing

Detail:
- Infrastructure requirements
- Configuration changes
- Monitoring setup
- Performance metrics
- Cost considerations
```

## Security Documentation Prompts

### Security Measures
```
Prompt: Generate security documentation including:
1. Authentication security
2. Data encryption
3. Input validation
4. Rate limiting
5. Audit logging

Cover:
- Security best practices
- Vulnerability prevention
- Compliance requirements
- Monitoring strategy
- Incident response
```

### Compliance Guide
```
Prompt: Create compliance documentation for:
1. Data protection
2. Access control
3. Audit requirements
4. Security policies
5. Incident response

Include:
- Regulatory requirements
- Security measures
- Audit procedures
- Documentation requirements
- Review process
```