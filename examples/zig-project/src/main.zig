const std = @import("std");

pub fn main() void {
    // Intentional error: unused local constant
    const unused_var: i32 = 42;

    // Intentional error: type mismatch
    const wrong_type: []const u8 = 123;

    std.debug.print("Hello, Zig!\n", .{});
}
