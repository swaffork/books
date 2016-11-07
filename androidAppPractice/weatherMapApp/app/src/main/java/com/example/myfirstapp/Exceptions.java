package com.example.myfirstapp;

public class Exceptions extends RuntimeException {

    // API key required:
    public class ApiKeyRequiredException extends RuntimeException {
        public ApiKeyRequiredException() {}
        public ApiKeyRequiredException(String detailMessage) {
            super(detailMessage);
        }
        public ApiKeyRequiredException(String detailMessage, Throwable t) {
            super(detailMessage, t);
        }
        public ApiKeyRequiredException(Throwable t) {
            super(t);
        }
    }

    // Location provider not found:
    public class LocationProviderNotFoundException extends RuntimeException {
        public LocationProviderNotFoundException() {}

        public LocationProviderNotFoundException(String detailMessage) {
            super(detailMessage);
        }

        public LocationProviderNotFoundException(String detailMessage, Throwable t) {
            super(detailMessage, t);
        }

        public LocationProviderNotFoundException(Throwable t) {
            super(t);
        }
    }

    // Weather provider instantiation:
    public class WeatherProviderInstantiationException extends Exception {

        public WeatherProviderInstantiationException() {}

        public WeatherProviderInstantiationException(String detailMessage) {
            super(detailMessage);
        }

        public WeatherProviderInstantiationException(String detailMessage, Throwable t) {
            super(detailMessage, t);
        }

        public WeatherProviderInstantiationException(Throwable t) {
            super(t);
        }
    }
}
