# Game & Watch (Zelda) Flashing Guide
This is a flashing guide for the Game & Watch (Zelda) device using a Raspberry Pi 4B device and 3 dupont cables.
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

### Game & Watch (Zelda) Schematic

| ▸     | ①    | **②**    | **③**  | ④  | **⑤**     | ⑥  | ⑦  |
| ----- | ---- | --------- | ------- | --- | --------- | --- | --- |
| Start | NRST | **SWDIO** | **GND** | VDD | **SWCLK** | N/A | N/A |

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
   

![screen2](https://user-images.githubusercontent.com/65086728/233509613-a76e7c6d-dfde-4b79-bd12-a26a565d74c2.jpeg)


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

15. Remove battery using a flathead screwdriver and use USB-C power instead.  Run these scripts in order, and follow instructions in the prompt to back up your firmware, and unlock the processor. If script fails, unplug USB-C power and plug it back in.
    ```bash
    ./1_sanity_check.sh rpi zelda
    ./2_backup_flash.sh rpi zelda
    ./3_backup_internal_flash.sh rpi zelda
    ./4_unlock_device.sh rpi zelda
    ./5_restore.sh rpi zelda
    ```
    #### 1_sanitycheck.sh
    ```
    Running sanity checks...
    Looks good!
    ```
    
    #### 2_backup_flash.sh
    ```
    Make sure your Game & Watch is turned on and in the time screen. Press return when ready!
    
    Attempting to dump flash using adapter rpi.
    Running OpenOCD... (This can take up to a few minutes.)
    Validating ITCM dump...
    Extracting checksummed part...
    dd if=backups/flash_backup_zelda.bin of=backups/flash_backup_checksummed_zelda.bin bs=16 skip=8192 count=197962
    Validating checksum...
    Looks good! Successfully backed up the (encrypted) SPI flash to backups/flash_backup_zelda.bin!
    ```
    
    #### 3_backup_internal_flash.sh
    ```
    Validating ITCM dump...
    This step will overwrite the contents of the SPI flash chip that we backed up in step 2.
    It will be restored in step 5. Continue? (y/N)
    yGenerating encrypted flash image from backed up data...
    Programming payload to SPI flash...
    Flash successfully programmed. Now do the following procedure:
    - Disconnect power from the device
    - Power it again
    - Press and hold the power button on the device
    - The LCD should show a blue screen
    - If it's not blue, you can try pressing the Time button on the device
    - Press return (while still holding the power button)!

    Dumping internal flash...
    Verifying internal flash backup...
    Device backed up successfully
    ```
    
    #### 4_unlock_device.sh
    ```
    Unlocking your device will erase its internal flash. Even though your backup
    is validated, this still can go wrong. Are you sure? (y/N)
    yValidating internal flash backup before proceeding...
    Unlocking device... (Takes up to 30 seconds.)
    Congratulations, your device has been unlocked. Just a few more steps!
    - The Game & Watch will not yet be functional
    - Disconnect power from the device for the changes to take full effect
    - Power it again
    - Run the 5_restore.sh script to restore the SPI and Internal Flash.
    ```

    #### 5_restore.sh
    ```
    Ok, restoring original firmware! (We will not lock the device, so you won't have to repeat this procedure!)
    Restoring SPI flash...
    Restoring internal flash...
    Success, your device should be running the original firmware again!
    (You should power-cycle the device now)
    ```
    
16. By the end of this, you'll have three files on the Raspberry Pi that you _should_ back up properly.
    | Filename                        | Size (KB) | CRC32    |
    | ------------------------------- | --------- | -------- |
    | flash_backup_zelda.bin          | 4096      | 1D93B749 |
    | itcm_backup_zelda.bin           | 2         | 77E4F34B |
    | internal_flash_backup_zelda.bin | 128       | 3420BCCF |

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
13. You can run the following command to check how much memory will be left:
    ```bash
    make clean
    make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/ COMPRESS=lzma GNW_TARGET=zelda size
    ```
    The results look something like this
    ```
    External flash usage
        Capacity:      3313664 Bytes (  3.160 MB)
        Usage:         3242835 Bytes (  3.093 MB)
        Free:            70829 Bytes (  0.068 MB)

    itcram	1336 / 65536	(64200 bytes free (0.061 MB))
    dtcram	105920 / 131072 (25152 bytes free)
    ram_uc	307200 / 307200	(0 bytes free (0.000 MB))
    ram	65280 / 69632	(4352 bytes free (0.004 MB))
    ram_emu_nes	108580 / 671744	(563164 bytes free (0.537 MB))
    ram_emu_gb	241024 / 671744	(430720 bytes free (0.411 MB))
    ram_emu_sms	0 / 671744	(671744 bytes free (0.641 MB))
    ram_emu_pce	0 / 671744	(671744 bytes free (0.641 MB))
    ram_emu_gw	0 / 671744	(671744 bytes free (0.641 MB))
    ahbram	5760 / 131072	(125312 bytes free (0.120 MB))
    flash	103856 / 131072	(27216 bytes free (0.026 MB))
    extflash	3242835 / 3313664	(70829 bytes free (0.068 MB))
    saveflash	720896 / 720896	(0 bytes free (0.000 MB))
    fbflash	153600 / 155648	(2048 bytes free (0.002 MB))
    ```

14. Flash your memory with compressed ROMs.
    ```bash
    make GCC_PATH=/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/ COMPRESS=lzma GNW_TARGET=zelda flash
    ```

15. If flashing fails, run the command above again, this time, hold the dupont cables in place, as they can get loose and lose contact with the board.

Here's an example of the output when flashing is completed successfully (Flashing 4 MB took about 10 minutes).
![screen3](https://user-images.githubusercontent.com/65086728/233509665-56b40973-3c4d-4748-b9ec-b07ce924a9f6.jpeg)


```
pi@rpi4b-8gb:~/opt/game-and-watch-retro-go $ make -j4 flash
Entering 'LCD-Game-Emulator'
Entering 'retro-go-stm32'
make[1]: Entering directory '/home/pi/opt/game-and-watch-retro-go'
[ BASH ] Checking for updated roms
[ BIN ] gw_retro_go_intflash.bin
/opt/openocd-git/bin/openocd -f scripts/interface_rpi.cfg -c "program build/gw_retro_go_intflash.bin 0x08000000 verify reset exit"
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Error: [stm32h7x.cpu0] Cortex-M PARTNO 0x0 is unrecognized
Warn : target stm32h7x.cpu0 examination failed
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 0 breakpoints, 0 watchpoints
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread 
xPSR: 0x01000000 pc: 0x0801ad48 msp: 0x2001b620
Error: Translation from khz to adapter speed not implemented
Error executing event reset-init on target stm32h7x.cpu0:
embedded:startup.tcl:1187: Error: 
in procedure 'program' 
in procedure 'ocd_process_reset' 
in procedure 'ocd_process_reset_inner' called at file "embedded:startup.tcl", line 1187
** Programming Started **
Info : Device: STM32H7Ax/7Bx
Info : flash size probed value 128k
Info : STM32H7 flash has dual banks
Info : Bank (0) size is 256 kb, base address is 0x08000000
Info : Padding image section 0 at 0x0801a424 with 12 bytes (bank write end alignment)
Warn : Adding extra erase range, 0x0801a430 .. 0x0801bfff
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
Preparing chunk 1 / 4 in file /tmp/flash_chunk.hnQHW2
Flashing!
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread 
xPSR: 0x01000000 pc: 0x08013c44 msp: 0x20020000
0x20020000
0x08013c45
msp (/32): 0x20020000
pc (/32): 0x08013c45
Starting flash app
State: FLASHAPP_INIT
Ready!
Loading data
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
Warn : [stm32h7x.cpu0] target was in unknown state when halt was requested
Loading image into RAM
851968 bytes written at address 0x24025800
downloaded 851968 bytes in 76.104347s (10.932 KiB/s)
65 bytes written at address 0x200014ec
downloaded 65 bytes in 0.006856s (9.259 KiB/s)
Starting flash process
Please see the LCD for interactive status.
State: FLASHAPP_CHECK_HASH_RAM
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_ERASE
State: FLASHAPP_PROGRAM
State: FLASHAPP_PROGRAM
Done, more chunks left!


Programming of chunk 1 / 4 succeeded.


Preparing chunk 2 / 4 in file /tmp/flash_chunk.vj6bON
Flashing!
Ready!
Loading data
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
Warn : [stm32h7x.cpu0] target was in unknown state when halt was requested
Loading image into RAM
851968 bytes written at address 0x24025800
downloaded 851968 bytes in 76.579376s (10.865 KiB/s)
65 bytes written at address 0x200014ec
downloaded 65 bytes in 0.006882s (9.224 KiB/s)
Starting flash process
Please see the LCD for interactive status.
State: FLASHAPP_CHECK_HASH_RAM
State: FLASHAPP_PROGRAM
Done, more chunks left!


Programming of chunk 2 / 4 succeeded.


Preparing chunk 3 / 4 in file /tmp/flash_chunk.nXHnrU
Flashing!
Ready!
Loading data
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
Warn : [stm32h7x.cpu0] target was in unknown state when halt was requested
Loading image into RAM
851968 bytes written at address 0x24025800
downloaded 851968 bytes in 77.099930s (10.791 KiB/s)
65 bytes written at address 0x200014ec
downloaded 65 bytes in 0.006811s (9.320 KiB/s)
Starting flash process
Please see the LCD for interactive status.
State: FLASHAPP_CHECK_HASH_RAM
State: FLASHAPP_PROGRAM
Done, more chunks left!


Programming of chunk 3 / 4 succeeded.


Preparing chunk 4 / 4 in file /tmp/flash_chunk.7RIZMZ
Flashing!
Ready!
Loading data
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
Warn : [stm32h7x.cpu0] target was in unknown state when halt was requested
Loading image into RAM
688267 bytes written at address 0x24025800
downloaded 688267 bytes in 61.677055s (10.898 KiB/s)
65 bytes written at address 0x200014ec
downloaded 65 bytes in 0.006940s (9.146 KiB/s)
Starting flash process
Please see the LCD for interactive status.
State: FLASHAPP_CHECK_HASH_RAM
State: FLASHAPP_PROGRAM
Done!


Programming of chunk 4 / 4 succeeded.


Programming of the external flash succeeded.


make[1]: Leaving directory '/home/pi/opt/game-and-watch-retro-go'
make[1]: warning: jobserver unavailable: using -j1.  Add '+' to parent make rule.
make[1]: Entering directory '/home/pi/opt/game-and-watch-retro-go'
# Reset the DBGMCU configuration register (DBGMCU_CR)
Open On-Chip Debugger 0.12.0+dev-00150-g91bd43134-dirty (2023-04-14-14:03)
Licensed under GNU GPL v2
For bug reports, read
	http://openocd.org/doc/doxygen/bugs.html
DEPRECATED! use 'sysfsgpio swd_nums' not 'sysfsgpio_swd_nums'
DEPRECATED! use 'sysfsgpio srst_num' not 'sysfsgpio_srst_num'
none separate
Info : SysfsGPIO JTAG/SWD bitbang driver
Info : Note: The adapter "sysfsgpio" doesn't support configurable speed
Info : SWD DPIDR 0x6ba02477
Info : [stm32h7x.cpu0] Cortex-M7 r1p1 processor detected
Info : [stm32h7x.cpu0] target has 8 breakpoints, 4 watchpoints
Info : gdb port disabled
Info : starting gdb server for stm32h7x.cpu0 on 3333
Info : Listening on port 3333 for gdb connections
[stm32h7x.cpu0] halted due to debug-request, current mode: Thread 
xPSR: 0x01000000 pc: 0x08013c44 msp: 0x20020000
make[1]: Leaving directory '/home/pi/opt/game-and-watch-retro-go'
```
# Part 4 - Clean Up and Get More Space
This section will be new for those following the original v1, v2, and v3 guides.  Consider this section as the continuation of the `vendo232` guide.

0. Before proceeding, remember to set your environment variables.  The only real difference here is a new path to `OPENOCD`.
   ```bash
   export OPENOCD="/opt/openocd-git/bin/openocd"
   export GCC_PATH="/home/pi/opt/xpack-arm-none-eabi-gcc-12.2.1-1.2/bin/"
   export ADAPTER="rpi"
   export GNW_TARGET="zelda"
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
   GNW_TARGET=zelda
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
   This can fit about 27 games with saving enabled.  The approximate ratio for ROMs to save file is roughly 1:7
   ![screen4](https://user-images.githubusercontent.com/65086728/233509964-13583a2c-cfae-486e-a464-5ff1f1bf255d.jpeg)

   
6. (Optional) To get a little more room, disable the saving feature by flashing again with the following command. Not recommended if you play long games such as Final Fantasy or Pokémon.  This option was able to fit up to 64 NES ROMs with `lzma` compression on a 4MB chip.
   ```bash
   make -j$(nproc) STATE_SAVING=0 flash
   ```

7. (Optional) Use a coin-sized piece of [Mr. Clean Magic Eraser](https://www.mrclean.com/en-us/shop-products/magic-erasers) to remove any print on the gold plate.  Be careful not to rub off too much of the red plastic.
