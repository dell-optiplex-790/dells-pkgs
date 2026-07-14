// rescue
var noUI = false, rescueTask = '';

(async function() {
    if(await w96.FS.exists('C:/.rescue')) {
        rescueTask = await w96.FS.readstr('C:/.rescue');
        await w96.FS.rm('C:/.rescue');
        noUI = true;
        await w96.FS.umount('X:');
        await w96.FS.umount('C:');
        var ram = w96.FS.mounts().find(mount => mount.driverName == 'ramfs');
        await w96.FS.umount(ram.prefix);
        await w96.FS.mount(new w96.fstype.RamFileSystem('C:'));
        await w96.FS.mount(new w96.fstype.IndexedFileSystem('X:'));
        await w96.util.sideloadZip('/system/images/rootfs/recovery.zip');
        w96.state.processes.find(e => e && e.title === "shell36").terminate();
        var build = window.$96.buildId;
        console.log(current.boxedEnv);
        setTimeout(function() {
            document.body.children[document.body.children.length - 2].remove();
            var gfx = document.getElementById('maingfx');
            gfx.style.display = '';
            gfx.style.background = 'transparent';
            var vga = document.getElementById('convga');
            vga.style.display = 'none';
            if(rescueTask) {
                return eval(rescueTask);
            }
            w96.sys.execCmd("terminal");
        }, 1500);
        var el = document.createElement('div');
        w96.isRecovery = true;
        document.body.className += ' user-desktop';
        el.className = 'build-info bright'
        el.innerText = 'Windows 96 ' + w96.sys.kInfo.branch + ' (Rescue mode)\nBuild ' + build;
        el.style.bottom = 0;
        el.style.textAlign = 'right';
        document.body.appendChild(el);
    }
})();