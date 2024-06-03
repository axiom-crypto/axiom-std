use axiom_sdk::run::run_cli;
mod account_age;

fn main() {
    run_cli::<account_age::AccountAgeInput>();
}
