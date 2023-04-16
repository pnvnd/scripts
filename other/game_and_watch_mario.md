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

<img width="341" alt="screen1" src="https://user-images.githubusercontent.com/65086728/232258492-266672c5-a47f-494b-b639-a365b2826386.png">

1. Install and launch the [Rasberry Pi Imager](https://www.raspberrypi.com/software/)
2. Choose OS > Raspberry Pi OS (other) > Raspberry Pi OS Lite (32-bit)
3. Select Advanced options and `Enable SSH` (Use password authentication)
4. Plug in dupont cables according to the following scheme

   | Raspberry Pi    | Nintendo  |
   | --------------- | --------- |
   | GPIO24 (pin 18) | ② (SWDIO) |
   | GPIO25 (pin 22) | ⑤ (SWCLK) |
   | GND (pin 39)    | ③ (GND)   |
   
![screen2](https://user-images.githubusercontent.com/65086728/232258587-76689e13-ba04-4d96-a301-2d0fcc9f747f.png)

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

15. Remove battery using a flathead screwdriver and use USB-C power instead.  Run these scripts in order, and follow instructions in the prompt to back up your firmware, and unlock the processor.
    ```bash
    ./1_sanity_check.sh rpi mario
    ./2_backup_flash.sh rpi mario
    ./3_backup_internal_flash.sh rpi mario
    ./4_unlock_device.sh rpi mario
    ./5_restore.sh
    ```
    
16. By the end of this, you'll have three files on the Raspberry Pi that you _should_ back up properly.
    | Filename                        | Size (KB) | CRC32    |
    | ------------------------------- | --------- | -------- |
    | flash_backup_mario.bin          | 1024      | 1B6BB635 |
    | itcm_backup_mario.bin           | 2         | 3B04248C |
    | internal_flash_backup_mario.bin | 128       | EFAAEFE6 |

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
    export OPENOCD="/home/pi/.local/xPacks/@xpack-dev-tools/openocd/0.12.0-1.1/.content/bin/openocd"
    ```

13. Flash your memory with compressed ROMs.
    ```bash
    make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/ COMPRESS=lzma GNW_TARGET=mario flash
    ```

14. If flashing fails, run the command above again, this time, hold the dupont cables in place, as they can get loose and lose contact with the board.

Here's an example of the output when flashing is completed successfully
![screen3](https://user-images.githubusercontent.com/65086728/232258689-5a80fa4a-adc2-4819-89d6-d80eb5f68ea6.png)

```
pi@rpi4b-8gb:~/opt/game-and-watch-retro-go $ make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/ COMPRESS=lzma GNW_TARGET=mario flash
Entering 'LCD-Game-Emulator'
Entering 'retro-go-stm32'
make[1]: Entering directory '/home/pi/opt/game-and-watch-retro-go'
[ BASH ] Checking for updated roms
/home/pi/.local/xPacks/@xpack-dev-tools/openocd/0.12.0-1.1/.content/bin/openocd -f scripts/interface_rpi.cfg -c "program build/gw_retro_go_intflash.bin 0x08000000 verify reset exit"
xPack Open On-Chip Debugger 0.12.0-01004-g9ea7f3d64-dirty (2023-01-30-15:09)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate

Info : SysfsGPIO JTAG/SWD bitbang driver
Info : This adapter doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread
xPSR: 0x01000000 pc: 0x080135c4 msp: 0x20020000
Error: Translation from khz to adapter speed not implemented
Error executing event reset-init on target stm32h7x.cpu0:
embedded:startup.tcl:1193: Error:
in procedure 'program'
in procedure 'ocd_process_reset'
in procedure 'ocd_process_reset_inner' called at file "embedded:startup.tcl", line 1193
** Programming Started **
Info : Device: STM32H7Ax/7Bx
Info : flash size probed value 128k
Info : STM32H7 flash has a single bank
Info : Bank (0) size is 128 kb, base address is 0x08000000
Info : Padding image section 0 at 0x0801990c with 4 bytes (bank write end alignment)
Warn : Adding extra erase range, 0x08019910 .. 0x08019fff
** Programming Finished **
** Verify Started **
** Verified OK **
** Resetting Target **
shutdown command invoked
make[1]: Leaving directory '/home/pi/opt/game-and-watch-retro-go'
make[1]: Entering directory '/home/pi/opt/game-and-watch-retro-go'
[ BASH ] Checking for updated roms
[ BIN ] gw_retro_go_extflash.bin
scripts/flash_multi.sh build/gw_retro_go_extflash.bin 0
Preparing chunk 1 / 1 in file /tmp/flash_chunk.6o6k0o
Flashing!
xPack Open On-Chip Debugger 0.12.0-01004-g9ea7f3d64-dirty (2023-01-30-15:09)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate

Info : SysfsGPIO JTAG/SWD bitbang driver
Info : This adapter doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread
xPSR: 0x01000000 pc: 0x080135c4 msp: 0x20020000
0x20020000
0x080135c5
msp (/32): 0x20020000

pc (/32): 0x080135c5

Starting flash app
State: FLASHAPP_INIT
Ready!
Loading data
xPack Open On-Chip Debugger 0.12.0-01004-g9ea7f3d64-dirty (2023-01-30-15:09)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate

Info : SysfsGPIO JTAG/SWD bitbang driver
Info : This adapter doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread
xPSR: 0x21070000 pc: 0x080002d0 msp: 0x2001fddc
Loading image into RAM
826428 bytes written at address 0x24025800
downloaded 826428 bytes in 72.018822s (11.206 KiB/s)

65 bytes written at address 0x2000126c
downloaded 65 bytes in 0.007050s (9.004 KiB/s)

Starting flash process
Please see the LCD for interactive status.
State: FLASHAPP_CHECK_HASH_RAM
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_PROGRAM_NEXT
State: FLASHAPP_PROGRAM
State: FLASHAPP_PROGRAM
State: FLASHAPP_PROGRAM
Done!


Programming of chunk 1 / 1 succeeded.


Programming of the external flash succeeded.


make[1]: Leaving directory '/home/pi/opt/game-and-watch-retro-go'
make[1]: Entering directory '/home/pi/opt/game-and-watch-retro-go'
# Reset the DBGMCU configuration register (DBGMCU_CR)
xPack Open On-Chip Debugger 0.12.0-01004-g9ea7f3d64-dirty (2023-01-30-15:09)
Licensed under GNU GPL v2
For bug reports, read
        http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate

Info : SysfsGPIO JTAG/SWD bitbang driver
Info : This adapter doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread
xPSR: 0x01000000 pc: 0x080135c4 msp: 0x20020000
make[1]: Leaving directory '/home/pi/opt/game-and-watch-retro-go'
```
# Part 4 - Clean Up and Get More Space
This section will be new for those following the original v1, v2, and v3 guides.  Consider this section as the continuation of the `vendo232` guide.

0. Before proceeding, remember to set your environment variables.  The only real difference here is a new path to `OPENOCD`.
   ```bash
   export OPENOCD="/opt/openocd-git/bin/openocd"
   export GCC_PATH="/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/"
   export ADAPTER="rpi"
   export GNW_TARGET="mario"
   export COMPRESS="lzma"
   export INTFLASH_BANK="1"
   ```
   Alternatively, add these environment variables permanantly by adding this to `/etc/environment` so that you don't need to set these every session.
   ```bash
   sudo nano /etc/environment
   ```
   The contents should look like this:
   ```bash
   OPENOCD=/opt/openocd-git/bin/openocd
   GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/
   ADAPTER=rpi
   GNW_TARGET=mario
   COMPRESS=lzma
   INTFLASH_BANK=1
   ```
   Use `CTRL+X` to exit, and when prompted to save, enter `Yes` to proceed.

1. Return to the previous `~/opt/` directory
   ```bash
   cd ~/opt/
   ```
2. Clone the patched version of [openocd](https://github.com/kbeckmann/ubuntu-openocd-git-builder) and go into the root directory of this repository
   ```bash
   git clone https://github.com/kbeckmann/ubuntu-openocd-git-builder.git
   cd ubuntu-openocd-git-builder
   ```
   
3. Compile and install the patched version of openocd
   ```bash
   ./build.sh
   sudo dpkg -i openocd-git_*_armhf.deb
   sudo apt-get -y -f install
   ```
   
4. Go back to the `game-and-watch-retro-go` repository
   ```bash
   cd ~/opt/game-and-watch-retro-go
   ```
   
5. Double-check environment variables.  Once confirmed, flash the firmware with `make -j$(nproc)` (which should be `make -j4` for Raspberry Pi 4B devices).  This should speed up the process when you use `make` significantly.
   ```bash
   make clean
   make -j$(nproc) flash
   ```
6. (Optional) To get a little more room, disable the saving feature by flashing again with the following command. Not recommended if you play long games such as Final Fantasy or Pokémon.  This option was able to fit up to 17 NES ROMs with `lzma` compression on a 1MB chip.
   ```bash
   make -j$(nproc) STATE_SAVING=0 flash
   ```
   ![screen4](https://user-images.githubusercontent.com/65086728/232258749-bd66ab11-0c77-4c34-932f-f6336d1573cd.png)

7. (Optional) Use a coin-sized piece of [Mr. Clean Magic Eraser](https://www.mrclean.com/en-us/shop-products/magic-erasers) to remove any print on the gold plate.  Be careful not to rub off too much of the red plastic.
   ![screen5](https://user-images.githubusercontent.com/65086728/232258871-c3348418-3bb1-4817-98f8-feb235b671c9.png)

