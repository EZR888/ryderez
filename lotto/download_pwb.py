import subprocess

base_url = "https://www.lotto-8.com/usa/listltoPOW.asp?indexpage="

for i in range(1, 41):  # 1 to 40 inclusive
    url = f"{base_url}{i}"
    output_file = f"output-{i}.txt"
    command = f'wget -qO- "{url}" | sed -e \'s/<[^>]*>//g\' > {output_file}'

    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ Fetched and saved: {output_file}")
    except subprocess.CalledProcessError:
        print(f"❌ Failed on index page {i}")

