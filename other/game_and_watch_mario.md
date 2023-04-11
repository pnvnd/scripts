# Game & Watch (Mario) Flashing Guide
This is a flashing guide for the Game & Watch (Mario) device using a Raspberry Pi 4B device and 3 dupont cables.
While this is not recommended, it is also the most economical solution option for those who already have a Rasbperry Pi device.

## Reference
This guide is based on the `vendo232` guides:
1. https://drive.google.com/file/d/11kkGMHlUPhibfyKQMqV80aRDrACqgsQz/view?usp=sharing (v3 guide)
2. https://drive.google.com/file/d/1-_H1eT0NAwtXMT63oJ-Y1zjwr6NR5MdA/view?usp=sharing (v2 guide)
3. https://drive.google.com/file/d/1kGac4ohnkP8rjvv0B2MbsQpdZBbfyIty/view?usp=sharing (v1 guide)

### Raspberry Pi Schematic

| GPIO   | Pin | Pin | GPIO   |
|--------|-----|-----|--------|
| 3V3    | 1   | 2   | 5V     |
| GPIO2  | 3   | 4   | 5V     |
| GPIO3  | 5   | 6   | Ground |
| GPIO4  | 7   | 8   | GPIO14 |
| Ground | 9   | 10  | GPIO15 |
| GPIO17 | 11  | 12  | GPIO18 |
| GPIO27 | 13  | 14  | Ground |
| GPIO22 | 15  | 16  | GPIO23 |
| 3V3    | 17  | **18**  | **GPIO24** |
| GPIO10 | 19  | 20  | Ground |
| GPIO9  | 21  | **22**  | **GPIO25** |
| GPIO11 | 23  | 24  | GPIO8  |
| Ground | 25  | 26  | GPIO7  |
| ID_SD  | 27  | 28  | ID_SC  |
| GPIO5  | 29  | 30  | Ground |
| GPIO6  | 31  | 32  | GPIO12 |
| GPIO13 | 33  | 34  | Ground |
| GPIO19 | 35  | 36  | GPIO16 |
| GPIO26 | 37  | 38  | GPIO20 |
| **Ground** | **39**  | 40  | GPIO21 |

### Game & Watch (Mario) Schematic

| ▸     | ①    | **②**     | **③**   | ④   | **⑤**     |
| ----- | ---- | --------- | ------- | --- | --------- |
| Start | NRST | **SWDIO** | **GND** | VDD | **SWCLK** |

# Part 1 - Get Respberry Pi Ready
1. Install and launch the [Rasberry Pi Imager](https://www.raspberrypi.com/software/)
2. Choose OS > Raspberry Pi OS (other) > Raspberry Pi OS Lite (32-bit)
3. Select Advanced options and `Enable SSH` (Use password authentication)
4. Plug in dupont cables according to the following scheme

   | Raspberry Pi    | Nintendo  |
   | --------------- | --------- |
   | GPIO24 (pin 18) | ② (SWDIO) |
   | GPIO25 (pin 22) | ⑤ (SWCLK) |
   | GND (pin 39)    | ③ (GND)   |
   

# Part 2 - Setup Raspberry Pi

Starting in your home directory `~` (or `cd ~`)

1. Install the latest updates 
   ```bash
   sudo apt update && sudo apt -y upgrade
   ```
2. Download the tools
   ```bash
   wget https://github.com/xpack-dev-tools/arm-none-eabi-gcc-xpack/releases/download/v12.2.1-1.2/xpack-arm-none-eabi-gcc-12.2.1-1.2-linux-arm.tar.gz
   ```
3. Create a a new directory `opt` in your home `~` directory
   ```bash
   mkdir -p ~/opt
   ```
4. Navigate to your newly created `~/opt` directory
   ```bash
   cd ~/opt
   ```
5. Extract the tools in the previous directory into the current directory
   ```bash
   tar xvf ../xpack-arm-none-eabi-gcc-12.2.1-1.2-linux-arm.tar.gz xpack-arm-none-eabi-gcc-12.2.1-1.2
   ```

6. Set an environment variable for the current session
   ```bash
   export PATH=$PATH:/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/
   ```
7. Raspberry Pi OS (Lite) doesn't come with Git installed, so install Git to clone repositories
   ```bash
   sudo apt -y install git
   ```
8. Clone the [ghidraninja/game-and-watch-backup](https://github.com/ghidraninja/game-and-watch-backup) repository in your `~/opt` directory
   ```bash
   git clone https://github.com/ghidraninja/game-and-watch-backup.git
   ```

9. Installing `npm` at this stage will get you Node.js 12.x.x, which is not compatible with `xpm`.  The following installs the latest LTS version of Node.js
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

10. Install `xpm`
    ```bash
    sudo npm install --global xpm@latest
    ```

11. Install OpenOCD as the current user.  Using `sudo` will result in a different path `/home/pi/.root/xPacks`.
    ```bash
    xpm install --global @xpack-dev-tools/openocd@latest
    ```
    
12. Set the `OPENOCD` environment variable
    ```bash
    export OPENOCD="/home/pi/.local/xPacks/@xpack-dev-tools/openocd/0.12.0-1.1/.content/bin/openocd"
    ```

13. Install more tools:
    ```bash
    sudo apt-get install binutils-arm-none-eabi python3 libftdi1
    ```

14. Go into the `game-and-watch-backup` directory
    ```bash
    cd game-and-watch-backup
    ```

15. Run these scripts in order, and follow instructions in the prompt.
    ```bash
    ./1_sanity_check.sh rpi mario
    ./2_backup_flash.sh rpi mario
    ./3_backup_internal_flash.sh rpi mario
    ./4_unlock_device.sh rpi mario
    ./5_restore.sh
    ```

# Part 3 - Install Retro-Go

1. Return to the `~/opt/` directory
   ```bash
   cd ..
   ```

2. Clone the [ghidraninja/game-and-watch-flashloader](https://github.com/ghidraninja/game-and-watch-flashloader) repository
   ```bash
   git clone https://github.com/ghidraninja/game-and-watch-flashloader.git
   ```
3. Go into the `game-and-watch-flashloader` repository
   ```bash
   cd game-and-watch-flashloader
   ```

4. Run the following command
   ```bash
   make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/
   ```

5. Return to the previous `~/opt/` directory
   ```bash
   cd ..
   ```

6. Clone the [kbeckmann/game-and-watch-retro-go](https://github.com/kbeckmann/game-and-watch-retro-go) repository, including the submodules
   ```bash
   git clone --recurse-submodules https://github.com/kbeckmann/game-and-watch-retro-go
   ```

7. Copy roms into the `roms/nes` directory.  Here's an example:
   ```bash
   cp ~/Downloads/rom.nes /home/pi/opt/game-and-watch-retro-go/roms/nes
   ```
8. Go into the `game-and-watch-retro-go` repository
   ```bash
   cd game-and-watch-retro-go
   ```

9. Raspberry Pi OS (Lite) does not come with `pip` installed, so we need to install this.
   ```bash
   sudo apt install -y python3-pip
   ```

10. Once `pip` is installed, run the following to install the packages required to flash your memory
    ```bash
    python3 -m pip install -r requirements.txt
    ```

11. Set another environment variable `ADAPTER` that the scripts will use.  In this case, we're specifically using the Raspberry Pi.
    ```bash
    export ADAPTER=rpi
    ```

12. If you haven't already done so already, set the environment variable for `OPENOCD`
    ```bash
    export OPENOCD="/home/pi/.local/xPacks/@xpack-dev-tools/openocd/0.11.0-1.1/.content/bin/openocd"
    ```

13. Flash your memory with compressed ROMs.
    ```bash
    make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/ COMPRESS=lzma GNW_TARGET=mario flash
    ```

14. If flashing fails, run the command above again, this time, hold the dupont cables in place, as they can get loose and lose contact with the board.