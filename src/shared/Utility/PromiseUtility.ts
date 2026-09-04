export async function delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
}

export type Result<T, E> = {
    success: true,
    value: T,
} | {
    success: false,
    error: E,
};

export type ErrorMessageResult<T> = Result<T, { message: string }>;