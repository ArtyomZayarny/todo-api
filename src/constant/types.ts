const TYPES = {
  UserService: Symbol.for('UserService'),
  TodoService: Symbol.for('TodoService'),
  AuthService: Symbol.for('AuthService'),
  EmailService: Symbol.for('EmailService'),
  RedisService: Symbol.for('RedisService'),
  S3Service: Symbol.for('S3Service'),
  SqsService: Symbol.for('SqsService'),
};

export default TYPES;
