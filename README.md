# API SPECIFICATION DOCUMENTATION

### Prerequisite
Sebelum deploy, buat 2 file berikut

#### .env
```
MODEL_URL=
DATABASE_URL=
JWT_SECRET=
HOST=
PORT=
```
#### serviceaccount.json
yang berisi key dari service account untuk upload ke gcp bucket

### Host

https://bangkit-capstone-425206.et.r.appspot.com/

## Register

Endpoint : /register

Method: POST

#### Request Body :

```json
{
    "email": "johndoe@mail.com",
    "name": "John Doe",
    "password": "secret",
    "role": "USER", // Optional
    "gender": "MALE"
}
```

#### Response Body (Success) :

200

```json
{
    "message": "user created",
    "status": "success"
}
```

#### Response Body (Failed) :

400

```json
{
    "status": "fail",
    "message": "Email already exists"
}
```

```json
{
    "status": "fail",
    "message": "\"password\" is required"
}
```

```json
{
    "statusCode": 400,
    "message": "Something went wrong"
}
```

## Login

Endpoint : /login

Method: POST

#### Request Body :

```json
{
    "email": "johndoe@mail.com",
    "password": "secret"
}
```

#### Response Body (Success) :

200

##### header :

authorization: Bearer token

```json
{
    "message": "logged in",
    "status": "success"
}
```

400

```json
{
    "status": "fail",
    "message": "Invalid email or password. Please try again."
}
```

```json
{
    "status": "fail",
    "message": "\"password\" is required"
}
```

## Logout

Endpoint : /logout

Method: DELETE

#### Request Body :

##### header :

authorization: Bearer token

```json
{}
```

#### Response Body (Success) :

204

```json
{}
```

#### Response Body (Failed) :

401

```json
{
    "status": "fail",
    "message": "Access denied. Please provide valid authentication credentials."
}
```

```json
{
    "status": "fail",
    "message": "Token is expired"
}
```

## Get User Data

Endpoint : /account

Method: GET

#### Request Body : -

##### header :

authorization: Bearer token

#### Response Body (Success) :

200

```json
{
    "message": "success get data",
    "status": "success",
    "user": {
        "id": "4336b8ea-6062-4b84-82fd-ba97ca64a0ae",
        "email": "johndoe@test.ad",
        "name": "john",
        "gender": "MALE",
        "image": "https://storage.googleapis.com/assets-webskinenthusiast/profile-image/user_default.png"
    }
}
```

#### Response Body (Failed) :

401

```json
{
    "status": "fail",
    "message": "Access denied. Please provide valid authentication credentials."
}
```

```json
{
    "status": "fail",
    "message": "Token is expired"
}
```

## Update User Data

Endpoint : /account

Method: POST

##### header :

authorization: Bearer token

#### Request Body :

```json
{
    "email": "johnupdatename@test.ad", // optional
    "name": "John Updated", // optional
    "password": "12345678", // optional
    "gender": "FEMALE"
}
```

#### Response Body (Success) :

200

```json
{
    "message": "success update data",
    "status": "success",
    "data": {
        "id": "e0b76d49-c29f-4132-a92e-809d1b5a6483",
        "email": "admin@test.ad",
        "name": "Hue",
        "gender": "FEMALE",
        "image_url": "https://storage.googleapis.com/assets-webskinenthusiast/profile-image/user_default.png"
    }
}
```

#### Response Body (Failed) :

401

```json
{
    "status": "fail",
    "message": "Access denied. Please provide valid authentication credentials."
}
```

```json
{
    "status": "fail",
    "message": "Token is expired"
}
```

409

```json
{
    "status": "fail",
    "message": "Email already exist"
}
```

## Upload Image User Data

Endpoint : /upload/image

Method: POST

##### header :

authorization: Bearer token

#### Request Body :

```json
{
    "image": file.jpeg
}
```

#### Response Body (Success) :

200

```json
{
    "message": "success update data",
    "status": "success",
    "data": {
        "image_url": "https://storage.googleapis.com/assets-webskinenthusiast/profile-image/user_default.png"
    }
}
```

#### Response Body (Failed) :

400

```json
{
    "status": "fail",
    "message": "Invalid file type. Only images are allowed."
}
```

401

```json
{
    "status": "fail",
    "message": "Access denied. Please provide valid authentication credentials."
}
```

```json
{
    "status": "fail",
    "message": "Token is expired"
}
```

415

```json
{
    "status": "fail",
    "message": "Unsupported Media Type"
}
```

## Predict

Endpoint : /predict

Method: POST

#### Request Body :

##### header :

authorization: Bearer token

```json
{
    "image": image.jpg
}
```

#### Response Body (Success) :

200

```json
{
    "status": "success",
    "message": "gambar dapat diproses",
    "data": {
        "id": "17f99fd6-e371-4d7b-94e0-b97e760d8b79",
        "result": "Kering",
        "nama": "Cetaphil Moisturizing Cream",
        "bahan": "Water, Glycerin, Petrolatum, Dimethicone",
        "benefit": "Melembapkan kulit kering secara intensif, Membantu memperbaiki penghalang kelembapan alami kulit, Menenangkan kulit yang iritasi dan pecah-pecah",
        "usage": "Oleskan krim pada kulit yang bersih. Pijat lembut hingga meresap sempurna. Gunakan dua kali sehari, pagi dan malam, atau sesuai kebutuhan."
    }
}
```

#### Response Body (Failed) :

400

```json
{
    "status": "fail",
    "message": "Terjadi kesalahan dalam melakukan prediksi"
}
```

401

```json
{
    "status": "fail",
    "message": "Token is expired"
}
```

```json
{
    "status": "fail",
    "message": "Access denied. Please provide valid authentication credentials."
}
```

413

```json
{
    "status": "fail",
    "message": "Payload content length greater than maximum allowed: 1048576"
}
```

415

```json
{
    "status": "fail",
    "message": "Unsupported Media Type"
}
```
