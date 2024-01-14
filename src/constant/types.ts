const TYPES = {
  UserService: Symbol.for('UserService'),
  TodoService: Symbol.for('TodoService'),
  AuthService: Symbol.for('AuthService'),
  EmailService: Symbol.for('EmailService'),
  RabbitMQService: Symbol.for('RabbitMQService'),
  RedisService: Symbol.for('RedisService'),
  S3Service: Symbol.for('S3Service'),
};

export default TYPES;
