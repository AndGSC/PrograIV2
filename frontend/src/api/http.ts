import {
    API_BASE_URL,
    MENSAJE_ERROR_GENERAL,
    MENSAJE_SESION_EXPIRADA,
    RUTA_LOGIN
} from '../utils/constants';

import {
    obtenerToken,
    cerrarSesion
} from '../utils/authStorage';

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ParametrosUrl = Record<string, string | number | boolean | null | undefined>;

interface HttpOptions {
    body?: unknown;
    params?: ParametrosUrl;
    headers?: HeadersInit;
    requiereAuth?: boolean;
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status: number, message: string, data?: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

function construirUrl(endpoint: string, params?: ParametrosUrl): string {
    const endpointNormalizado = endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

    const url = new URL(`${API_BASE_URL}${endpointNormalizado}`);

    if (params) {
        Object.entries(params).forEach(([clave, valor]) => {
            if (valor !== null && valor !== undefined && valor !== '') {
                url.searchParams.append(clave, String(valor));
            }
        });
    }

    return url.toString();
}

function obtenerMensajeError(data: unknown): string {
    if (!data) {
        return MENSAJE_ERROR_GENERAL;
    }

    if (typeof data === 'string') {
        return data;
    }

    if (typeof data === 'object') {
        const objeto = data as Record<string, unknown>;

        if (typeof objeto.mensaje === 'string') {
            return objeto.mensaje;
        }

        if (typeof objeto.message === 'string') {
            return objeto.message;
        }

        if (typeof objeto.error === 'string') {
            return objeto.error;
        }
    }

    return MENSAJE_ERROR_GENERAL;
}

async function leerRespuesta(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }

    return await response.text();
}

async function httpRequest<T>(
    endpoint: string,
    metodo: MetodoHttp,
    opciones: HttpOptions = {}
): Promise<T> {
    const {
        body,
        params,
        headers,
        requiereAuth = true
    } = opciones;

    const url = construirUrl(endpoint, params);
    const esFormData = body instanceof FormData;

    const requestHeaders = new Headers(headers);

    requestHeaders.set('Accept', 'application/json');

    if (body !== undefined && !esFormData) {
        requestHeaders.set('Content-Type', 'application/json');
    }

    if (requiereAuth) {
        const token = obtenerToken();

        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(url, {
        method: metodo,
        headers: requestHeaders,
        body: body !== undefined
            ? esFormData
                ? body
                : JSON.stringify(body)
            : undefined
    });

    const data = await leerRespuesta(response);

    if (!response.ok) {
        if (response.status === 401) {
            cerrarSesion();

            if (window.location.pathname !== RUTA_LOGIN) {
                window.location.href = RUTA_LOGIN;
            }

            throw new ApiError(
                response.status,
                MENSAJE_SESION_EXPIRADA,
                data
            );
        }

        throw new ApiError(
            response.status,
            obtenerMensajeError(data),
            data
        );
    }

    return data as T;
}

export function httpGet<T>(
    endpoint: string,
    params?: ParametrosUrl,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'GET', {
        params,
        requiereAuth
    });
}

export function httpPost<T>(
    endpoint: string,
    body?: unknown,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'POST', {
        body,
        requiereAuth
    });
}

export function httpPut<T>(
    endpoint: string,
    body?: unknown,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'PUT', {
        body,
        requiereAuth
    });
}

export function httpPatch<T>(
    endpoint: string,
    body?: unknown,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'PATCH', {
        body,
        requiereAuth
    });
}

export function httpDelete<T>(
    endpoint: string,
    body?: unknown,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'DELETE', {
        body,
        requiereAuth
    });
}

export function httpUpload<T>(
    endpoint: string,
    formData: FormData,
    requiereAuth = true
): Promise<T> {
    return httpRequest<T>(endpoint, 'POST', {
        body: formData,
        requiereAuth
    });
}