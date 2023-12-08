// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

use std::io::{Write, stderr, stdout};

fn main() {
  println!("sdavids-project-template");
  eprintln!("sdavids-project-template");
  stdout().flush().expect("could not flush stdout");
  stderr().flush().expect("could not flush stderr");
}
