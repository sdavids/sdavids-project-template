// SPDX-FileCopyrightText: © 2024 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

use std::io::{stderr, stdout, Write};

fn main() {
  println!("sdavids-project-template");
  eprintln!("sdavids-project-template");
  stdout().flush().expect("could not flush stdout");
  stderr().flush().expect("could not flush stderr");
}
