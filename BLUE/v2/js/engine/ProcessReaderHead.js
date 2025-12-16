class ProcessReaderHead {
    constructor (id, owner, editor_id, address, memsize) {
        this._id = id;
        this._owner = owner;
        this._warrior_id = editor_id;
        this._address = address;
        this._memsize = memsize;
        this._origin_addr = address;
        this._flow_dir = 1; // (=) down direction by default
        // 
        this.alive = true;
        this.repeater = 0;
        this.iop = 0;
        warriors[this._warrior_id].plist.push(this);
    }

    /********************************************
     * GETTERS & SETTERS
     ********************************************/

    get id() {
        return this._id;
    }

    get owner() {
        return this._owner;
    }

    get warrior_id() {
        return this._warrior_id;
    }

    get memsize() {
        return this._memsize;
    }

    get flow_dir() {
        return this._flow_dir;
    }

    _switch_flow_dir() {
        this._flow_dir = -this._flow_dir; 
    }

    get address() {
        return this._address;
    }

    set address(addr) {
        this._address = (addr + this.memsize) % this.memsize;
    }

    /********************************************
     * INTERNALS - PRIVATE / UTILS
     ********************************************/

    _compute_addr(addr) {
        return (addr + this.memsize) % this.memsize;
    }

    /* Advances the instruction pointer by one step
        in the current flow direction.
    */
    _stepIP() {
        this.address += this.flow_dir;
    }

    _kill() {
        this.alive = false;
        const index = warriors[this._warrior_id].plist.indexOf(this);
        if (index != -1) {
            const pk = warriors[this._warrior_id].plist[index];
            // console.log("killed: ", pk);
            warriors[this._warrior_id].plist.splice(index, 1);
        }
    }

    _tryResolveDelta(arg) {
        if (arg == null) {
            console.error("tryResolveDelta null arg");
            return null;
        }
        let delta = Number(arg);
        if (arg[0] == '*') {
            let sdelta = Number(arg.slice(1));
            // if (arg[1] == '+')
                // sdelta = Number(arg.slice(2));
            // console.log("sdelta", sdelta);
            let saddr = this._compute_addr(this.address + sdelta);
            delta = Number(mem[saddr].value);
            // console.warn(mem[saddr].value);
        }
        if (isIntegerStrict(delta) == false) {
            // console.warn("tryResolveDelta not a integer addr:", arg, "->", delta);
            return null;
        }
        return delta;
    }

    /********************************************
     * INSTRUCTIONS CODE
     ********************************************/

    jump(args) {
        const delta = this._tryResolveDelta(args[1]);
        if (delta == null) {
            this._stepIP();
            return;
        }
        this.address = this._compute_addr(this.address + delta);
    }

    copy(args) {
        if (this.repeater == 0) {
            const delta = this._tryResolveDelta(args[3]);
            if (delta == null) {
                this._stepIP();
                return;
            }
            this.repeater = delta;  // nb cell to copy
            this.iop = 0;
        }
        if (this.repeater > 0) {
            const delta_src = this._tryResolveDelta(args[2]);
            const delta_dest = this._tryResolveDelta(args[1]);
            if (delta_src == null || delta_dest == null) {
                this.repeater = 0;
                this.iop = 0;
                this._stepIP();
                return;
            }
            const start_addr = this.address;

            let addr_src = this._compute_addr(start_addr + this.iop + delta_src);
            let cell_src = mem[addr_src];

            let addr_dest = this._compute_addr(start_addr + this.iop + delta_dest);
            mem[addr_dest] = cell_src;

            this.iop++;
            this.repeater--;
            if (this.repeater == 0) { // last action done, we stepip
                this.iop = 0; // reset
                this._stepIP();
            }
        }
    }

    wait(args) {
        if (this.repeater == 0) {
            const delta = this._tryResolveDelta(args[1]);
            if (delta == null) {
                this._stepIP();
                return;
            }
            this.repeater = delta;    // nb cycles to do nothing
            if (this.repeater == 0) {
                this._kill(); // wait 0 illegal
            }
            this.iop = 0;
        }
        if (this.repeater > 0) {
            this.iop++;
            this.repeater--;
            if (this.repeater == 0) { // last wait done, we move
                this.iop = 0; // reset
                this._stepIP();
            }
        }
    }

    spin(args) {
        const spin_addr = this.address;
        const spin_cell = mem[spin_addr];
        let c1 = spin_cell.args[1];
        let c2 = spin_cell.args[2];
        let c3 = spin_cell.args[3];

        if (!c3)
        {
            spin_cell.args[1] = c2;
            spin_cell.args[2] = c1;
        }
        else {
            spin_cell.args[1] = c2;
            spin_cell.args[2] = c3;
            spin_cell.args[3] = c1;
        }
        this._stepIP();
    }

    mset(args) {
        if (isIncOrDec(args[1])) {
            // console.log(JSON.stringify(args));
            args = convertIncDec(args[1]);
            // console.log(JSON.stringify(args));
        }
        // console.log(JSON.stringify(args));
        const mset_cell_offset = Number(args[1]);
        let mset_addr = this._compute_addr(this.address + mset_cell_offset);
        // console.log("MSET pre:", mem[mset_addr]);
        let value = mem[mset_addr].value;
        if (args[2] == "+=") {
            if (isIntegerStrict(Number(value))) {
                value = Number(value) + Number(args[3]);
                mem[mset_addr].value = value;
                mem[mset_addr].owner = this.owner;
                // console.log(mset_addr, mem[mset_addr]);
            }
            else {
                // is isntruction so do nothing
            }
        }
        // console.log("MSET end:", mem[mset_addr]);
        this._stepIP();
    }

    fork(args) {
        const delta = this._tryResolveDelta(args[1]);
        if (delta == null) {
            this._stepIP();
            return;
        }
        if (warriors[this.warrior_id].plist.length == MAX_FORK) {
            this._stepIP();
            return;
        }
        const fork_addr = this._compute_addr(this.address + delta);
        // use plist.length as new id for new process
        new ProcessReaderHead(warriors[this._warrior_id].plist.length, this.owner, this.warrior_id, fork_addr, this.memsize);
        this._stepIP();
    }

    flip(args) {
        const delta = this._tryResolveDelta(args[1]);
        if (delta == null) {
            this._stepIP();
            return;
        }
        const flip_addr = this._compute_addr(this.address + delta);
        warriors.forEach(w => {
            w.plist.forEach(process => {
                if (process.address === flip_addr) {
                    process._switch_flow_dir();
                }
            });
        });
        this._stepIP();
    }
}

// const MEMSIZE = 16384;      // 2^14
// const MASK = MEMSIZE - 1;   // 16383 -> b11111111111111
function compute(addr) {
        return addr & this._mask;
}

function readCell(mem, addr) {
    return mem[addr & MASK];
}

function writeCell(mem, addr, value) {
    mem[addr & MASK] = value;
}
