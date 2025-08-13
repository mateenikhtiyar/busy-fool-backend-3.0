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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_entity_1 = require("../users/user.entity");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    mailService;
    configService;
    constructor(usersRepository, jwtService, mailService, configService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.configService = configService;
    }
    async register(createUserDto) {
        const existingUser = await this.usersRepository.findOneBy({
            email: createUserDto.email,
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const user = this.usersRepository.create(createUserDto); // Creates entity, triggers BeforeInsert
        await this.usersRepository.save(user); // Saves with hashed password
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            fullName: user.name ?? '',
            email: user.email,
            role: user.role,
        };
    }
    async login(loginDto) {
        const user = await this.usersRepository.findOneBy({
            email: loginDto.email,
        });
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            fullName: user.name ?? '',
            email: user.email,
            role: user.role,
        };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user;
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async uploadProfilePicture(userId, file) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        user.profilePicture = file.filename;
        return this.usersRepository.save(user);
    }
    async logout(userId) {
        return; // Placeholder; implement token blacklisting if needed
    }
    async forgotPassword(email) {
        const user = await this.usersRepository.findOneBy({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
        await this.usersRepository.save(user);
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        await this.mailService.sendMail(user.email, 'Password Reset Request', `Please use the following link to reset your password: ${resetLink}`, `<p>Please use the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`);
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.usersRepository.save(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map