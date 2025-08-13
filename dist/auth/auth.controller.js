"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const update_user_dto_1 = require("../users/dto/update-user.dto");
const login_dto_1 = require("./dto/login.dto");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const user_entity_1 = require("../users/user.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    login(loginDto) {
        return this.authService.login(loginDto);
    }
    getProfile(req) {
        return this.authService.getProfile(req.user.sub);
    }
    updateProfile(req, updateUserDto) {
        return this.authService.updateProfile(req.user.sub, updateUserDto);
    }
    uploadProfilePicture(req, file) {
        return this.authService.uploadProfilePicture(req.user.sub, file);
    }
    logout(req) {
        return this.authService.logout(req.user.sub);
    }
    async forgotPassword(email) {
        await this.authService.forgotPassword(email);
        return {
            message: 'If a user with that email exists, a password reset link has been sent.',
        };
    }
    async resetPassword(token, newPassword) {
        await this.authService.resetPassword(token, newPassword);
        return { message: 'Password has been reset successfully.' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request (e.g., email already registered or invalid data)',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john.doe@example.com' },
                password: { type: 'string', example: 'securepassword123' },
                role: { type: 'string', enum: ['owner', 'staff'], example: 'owner' },
            },
            required: ['name', 'email', 'password', 'role'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login a user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User logged in successfully',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized (invalid credentials)',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'john.doe@example.com' },
                password: { type: 'string', example: 'securepassword123' },
            },
            required: ['email', 'password'],
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile updated successfully',
        type: user_entity_1.User,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request (e.g., invalid data)' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Doe Updated', nullable: true },
                email: {
                    type: 'string',
                    example: 'john.doe.updated@example.com',
                    nullable: true,
                },
                password: {
                    type: 'string',
                    example: 'newsecurepassword123',
                    nullable: true,
                },
                profilePicture: {
                    type: 'string',
                    example: 'https://example.com/newpic.jpg',
                    nullable: true,
                },
                phoneNumber: { type: 'string', example: '+9876543210', nullable: true },
                address: {
                    type: 'string',
                    example: '456 Tea Lane, Brewtown',
                    nullable: true,
                },
                bio: { type: 'string', example: 'Tea lover and coder', nullable: true },
                dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '1990-01-01',
                    nullable: true,
                },
            },
            required: [],
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload-profile-picture'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized (missing or invalid JWT)',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a password reset link' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset email sent if user exists.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request (e.g., invalid email format)',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'john.doe@example.com' },
            },
            required: ['email'],
        },
    }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using a token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password has been reset successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired token, or invalid password.',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'some_long_reset_token' },
                newPassword: { type: 'string', example: 'newSecurePassword123' },
            },
            required: ['token', 'newPassword'],
        },
    }),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map