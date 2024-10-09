import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
    name: 'TotalAttemptsGreaterOrEqualToSuccessfulAttempts',
    async: false,
})
export class TotalAttemptsGreaterOrEqualToSuccessfulAttempts
    implements ValidatorConstraintInterface
{
    validate(totalAttempts: number, args: ValidationArguments): boolean {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-assignment
        const object = args.object as any;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return totalAttempts >= object.successfulAttempts;
    }

    defaultMessage(_validationArguments?: ValidationArguments): string {
        return 'Total attempts must be greater than or equal to successful attempts';
    }
}
