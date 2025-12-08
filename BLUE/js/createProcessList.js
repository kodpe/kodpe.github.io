class ProcessReaderHead {
    constructor (id, owner, address) {
        this.id = id;
        this.owner = owner;
        this.address = address;
        this.alive = true;
        this.flow_dir = 1; // reverse is -1
        this.repeater = 0;
        this.iop = 0;
        plist.push(this);
    }

    move() {
        this.address = (this.address + 1 * this.flow_dir) % MEM_SIZE;
    }

    jump(args) {
        let delta = Number(args[1]);
        this.address = (this.address + delta) % MEM_SIZE;
    }

    copy(args) {
        // console.log(this.id, args)
        if (this.repeater == 0) {
            this.repeater = Number(args[3]);    // nb cell to copy
            this.iop = 0;
        }
        if (this.repeater > 0) {
            const start_addr = this.address;
            // console.log("start_addr", start_addr);
            // console.log("args[2]", args[2]);
            // console.log("iop", this.iop);
            // console.log("repeater", this.repeater);

            let addr_src = start_addr + this.iop + Number(args[2]);
            let cell_src = mem[addr_src % mem.length];

            let addr_dest = start_addr + this.iop + Number(args[1]);
            mem[addr_dest % mem.length] = cell_src;

            // console.log("copied:", cell_src);

            this.iop++;
            this.repeater--;
            if (this.repeater == 0) { // last action done, we move
                this.iop = 0; // reset
                this.move();
            }
        }
    }

    wait() {
        // do nothing
    }

    fork(args) {
        let delta = Number(args[1]);
        let fork_addr = (this.address + delta) % MEM_SIZE;
        // use plist.length as new id for new process
        new ProcessReaderHead(plist.length, this.owner, fork_addr);
        this.move();
    }

    kill() {
        this.alive = false;
        const index = plist.indexOf(this);
        if (index != -1) {
            console.log("PLIST.len", plist.length);
            console.log("PLIST", plist);
            plist.splice(index, 1);
        }
    }
}

let plist = [];
function createProcessList(name1, adr1, name2, adr2) {
    plist = [];
    new ProcessReaderHead(plist.length, name1, adr1);
    new ProcessReaderHead(plist.length, name2, adr2);

    // debug
    // console.log(JSON.stringify(plist, null, 2));
    // plist[0].fork(-10);
    // plist[1].fork(-10);
    // plist[0].fork(+50);
    // plist[1].fork(+50);
    // console.log(JSON.stringify(plist, null, 2));

    return plist;
}