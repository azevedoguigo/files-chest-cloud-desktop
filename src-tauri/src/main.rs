#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use downloader::Downloader;

#[tauri::command]
fn download_file(url: String) {
    let mut downloader = Downloader::builder()
        .download_folder(std::path::Path::new("/home/guilherme/Downloads/"))
        .parallel_requests(1)
        .build()
        .unwrap();

    let dl = downloader::Download::new(&url);

    #[cfg(feature = "verify")]
    let dl = {
        use downloader::verify;
        fn decode_hex(s: &str) -> Result<Vec<u8>, std::num::ParseIntError> {
            (0..s.len())
                .step_by(2)
                .map(|i| u8::from_str_radix(&s[i..i + 2], 16))
                .collect()
        }
        dl.verify(verify::with_digest::<sha3::Sha3_256>(
            decode_hex("2197e485d463ac2b868e87f0d4547b4223ff5220a0694af2593cbe7c796f7fd6").unwrap(),
        ))
    };

    let result = downloader.download(&[dl]).unwrap();

    for r in result {
        match r {
            Err(e) => println!("Error: {}", e.to_string()),
            Ok(s) => println!("Success: {}", &s),
        };
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
