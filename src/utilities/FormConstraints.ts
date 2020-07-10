
//Length constraints
export const NameMinLength: number = 2;
export const NameMaxLength: number = 70;
export const UsernameMaxLength: number = 70; 
export const PasswordMinLength: number = 8;
export const PasswordMaxLength: number = 100;


//Pattern constraints
export const EmailPattern: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const NamePattern: RegExp = /^[a-z ,.'-]+$/i;
export const UsernamePattern: RegExp = /^[a-zA-Z0-9]+$/;


//Constrait Messages 
export const RequiredMessage: string = 'required';

export const InvaildMessage = (field:string):string => {
    return `invalid ${field}`
}

export const MinLengthMessage = (length:number):string => {
    return `minimum length of ${length}`
}

export const MaxLengthMessage = (length:number):string => {
    return `maximum length of ${length}`
}