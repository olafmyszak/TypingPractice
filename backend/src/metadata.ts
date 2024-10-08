/* eslint-disable */
export default async () => {
    const t = {
        ["./user/entities/user.entity"]: await import("./user/entities/user.entity")
    };
    return { "@nestjs/swagger/plugin": { "models": [[import("./user/dto/create-user.dto"), { "CreateUserDto": { username: { required: true, type: () => String }, password: { required: true, type: () => String } } }], [import("./user/entities/user.entity"), { "User": { id: { required: true, type: () => Number }, username: { required: true, type: () => String }, password: { required: true, type: () => String } } }], [import("./user/dto/create-user-response.dto"), { "UserResponseDto": { id: { required: true, type: () => Number }, username: { required: true, type: () => String } } }], [import("./auth/dto/sign-in.dto"), { "SignInDto": { username: { required: true, type: () => String }, password: { required: true, type: () => String } } }], [import("./user/dto/update-user.dto"), { "UpdateUserDto": {} }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }], [import("./user/user.controller"), { "UserController": { "create": { type: t["./user/entities/user.entity"].User }, "findAll": { type: [t["./user/entities/user.entity"].User] } } }], [import("./auth/auth.controller"), { "AuthController": { "signIn": {}, "getProfile": { type: Object } } }]] } };
};
