use actix_web::{get, App, HttpServer, Responder, HttpRequest, HttpResponse, web};
use include_dir::{include_dir, Dir};
use mime_guess::from_path;

const PORT: u16 = 8080;

static STATIC_DIR: Dir = include_dir!("../static");

#[get("/api/hello")]
async fn hello() -> impl Responder {
    "Hello from Actix API!"
}

async fn static_handler(req: HttpRequest) -> actix_web::Result<HttpResponse> {
    let path = req.path().trim_start_matches('/');

    let file_path = if path.is_empty() || path.ends_with('/') {
        "index.html"
    } else {
        path
    };

    if let Some(file) = STATIC_DIR.get_file(file_path) {
        let mime = from_path(file_path).first_or_octet_stream();
        Ok(HttpResponse::Ok()
            .content_type(mime.as_ref())
            .body(file.contents()))
    } else {
        Ok(HttpResponse::NotFound().body("404 Not Found"))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at: http://0.0.0.0:{PORT}");

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .default_service(web::route().to(static_handler))
    })
    .bind(("0.0.0.0", PORT))?
    .run()
    .await
}
