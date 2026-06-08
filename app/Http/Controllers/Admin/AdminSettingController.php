<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\EmailSetting;
use App\Models\Script;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
class AdminSettingController extends Controller
{
    public function index()
    {
        $setting = Setting::first();

        return Inertia::render('Admin/Settings/index', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'website_title'    => 'required|string|max:251',
            'start_keyword'    => 'nullable|string',
            'service_keyword'  => 'nullable|string',
            'locations'        => 'nullable|string',
            'email'            => 'nullable|email|max:251',
            'phone'            => 'nullable|string|max:251',
            'address'          => 'nullable|string',
            'preloader'        => 'nullable|string|max:251',
            'timing'           => 'nullable|string|max:251',
            'logo'             => 'nullable|file|image|mimes:jpg,jpeg,png,webp,svg|max:5120',
            'favicon'          => 'nullable|file|image|mimes:jpg,jpeg,png,webp,svg,ico|max:2048',
        ]);

        $uploadPath = public_path('uploads/settings');
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            $logoName = 'logo_' . time() . '.' . $logo->getClientOriginalExtension();
            $logo->move($uploadPath, $logoName);
            $validated['logo'] = $logoName;
        } elseif ($request->filled('logo')) {
            $validated['logo'] = $request->input('logo');
        }

        if ($request->hasFile('favicon')) {
            $favicon = $request->file('favicon');
            $faviconName = 'favicon_' . time() . '.' . $favicon->getClientOriginalExtension();
            $favicon->move($uploadPath, $faviconName);
            $validated['favicon'] = $faviconName;
        } elseif ($request->filled('favicon')) {
            $validated['favicon'] = $request->input('favicon');
        }

        // Also update the old column for backward compatibility
        if (isset($validated['start_keyword'])) {
            $validated['strating_keyword'] = $validated['start_keyword'];
        }

        $setting = Setting::first();

        if ($setting) {
            $setting->update($validated);
        } else {
            Setting::create($validated);
        }

        return redirect()->route('admin.settings.index')
            ->with('success', 'Settings updated successfully.');
    }

    public function email()
    {
        $setting = EmailSetting::first();

        return Inertia::render('Admin/Settings/Email', [
            'setting' => $setting,
        ]);
    }

    public function updateEmail(Request $request)
    {
        if (Schema::hasTable('email_setting') && ! Schema::hasColumn('email_setting', 'from_name')) {
            Schema::table('email_setting', function (Blueprint $table) {
                $table->string('from_name')->nullable()->after('from_address');
            });
        }

        $validated = $request->validate([
            'driver'       => 'nullable|string|max:50',
            'host'         => 'nullable|string|max:255',
            'port'         => 'nullable|string|max:10',
            'username'     => 'nullable|string|max:255',
            'password'     => 'nullable|string|max:255',
            'encryption'   => 'nullable|string|max:10',
            'from_address' => 'nullable|email|max:255',
            'from_name'    => 'nullable|string|max:255',
            'sendmail'     => 'nullable|string|max:255',
        ]);

        $setting = EmailSetting::first();

        if ($setting) {
            $setting->update($validated);
        } else {
            EmailSetting::create($validated);
        }

        return redirect()->route('admin.settings.email')
            ->with('success', 'Email settings updated successfully.');
    }

    public function testEmail()
    {
        return redirect()->route('admin.settings.email')
            ->with('success', 'Test email sent successfully!');
    }

    public function scripts()
    {
        $scripts = Script::all();

        return Inertia::render('Admin/Settings/Scripts', [
            'scripts' => $scripts,
        ]);
    }

    public function storeScript(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'script' => 'nullable|string',
            'is_publish' => 'nullable|integer',
            'status' => 'nullable|integer',
        ]);

        Script::create($validated);

        return redirect()->route('admin.settings.scripts')
            ->with('success', 'Script added successfully.');
    }

    public function updateScript(Request $request, $id)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'script'     => 'nullable|string',
            'is_publish' => 'nullable|integer',
            'status'     => 'nullable|integer',
        ]);

        $script = Script::findOrFail($id);
        $script->update($validated);

        return redirect()->route('admin.settings.scripts')
            ->with('success', 'Script updated successfully.');
    }

    public function userManagement()
    {
        return Inertia::render('Admin/Settings/UserManagement');
    }

    public function addRole()
    {
        $roles = Role::all();

        return Inertia::render('Admin/Settings/AddRole', [
            'roles' => $roles,
        ]);
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()->route('admin.settings.user-management.add-role')
            ->with('success', 'Role added successfully.');
    }

    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$id,
        ]);

        $role = Role::findOrFail($id);
        $role->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('admin.settings.user-management.add-role')
            ->with('success', 'Role updated successfully.');
    }

    public function destroyRole($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('admin.settings.user-management.add-role')
            ->with('success', 'Role deleted successfully.');
    }

    public function addUser()
    {
        return Inertia::render('Admin/Settings/AddUser');
    }

    public function permissions()
    {
        $permissions = Permission::all();

        return Inertia::render('Admin/Settings/Permission', [
            'permissions' => $permissions,
        ]);
    }

    public function plugin()
    {
        return Inertia::render('Admin/Settings/Plugin');
    }

    public function tags()
    {
        return Inertia::render('Admin/Settings/Tags');
    }
}
