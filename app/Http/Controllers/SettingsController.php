<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::orderBy('key')->paginate(10);
        
        return Inertia::render('settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('settings/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'key' => 'required|string|max:255|unique:settings,key',
                'value' => 'nullable|string',
            ]);

            // Validate JSON if it looks like JSON
            $value = $request->value;
            if ($value && (str_starts_with(trim($value), '{') || str_starts_with(trim($value), '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', 'Định dạng JSON không hợp lệ: ' . json_last_error_msg());
                }
                $value = $decoded;
            }

            Setting::create([
                'key' => $request->key,
                'value' => $value,
            ]);

            return redirect()->route('general-settings.index')
                ->with('success', 'Cài đặt đã được tạo thành công!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $setting = Setting::findOrFail($id);
        
        return Inertia::render('settings/Show', [
            'setting' => $setting,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $setting = Setting::findOrFail($id);
        
        return Inertia::render('settings/Edit', [
            'setting' => $setting,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $setting = Setting::findOrFail($id);
            
            $request->validate([
                'key' => 'required|string|max:255|unique:settings,key,' . $id,
                'value' => 'nullable|string',
            ]);

            // Validate JSON if it looks like JSON
            $value = $request->value;
            if ($value && (str_starts_with(trim($value), '{') || str_starts_with(trim($value), '['))) {
                $decoded = json_decode($value, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', 'Định dạng JSON không hợp lệ: ' . json_last_error_msg());
                }
                $value = $decoded;
            }

            $setting->update([
                'key' => $request->key,
                'value' => $value,
            ]);

            return redirect()->route('general-settings.index')
                ->with('success', 'Cài đặt đã được cập nhật thành công!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $setting = Setting::findOrFail($id);
            $settingKey = $setting->key;
            $setting->delete();

            return redirect()->route('general-settings.index')
                ->with('success', "Cài đặt '{$settingKey}' đã được xóa thành công!");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Có lỗi xảy ra khi xóa cài đặt: ' . $e->getMessage());
        }
    }
}
