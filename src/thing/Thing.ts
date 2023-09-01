import type { IfEquals } from '../types/IfEquals.js';

type OmitableProps<T extends Record<string, any>> = Pick<
	T,
	{
		[k in keyof T]: IfEquals<
			{ [_ in k]: T[k] },
			{ [_ in k]-?: T[k] },
			never,
			k
		>;
	}[keyof T]
>;
type UnomitProps<
	Target extends Record<string, any>,
	Source extends Record<string, any>,
> = {
	[k in keyof Source]: IfEquals<
		{ [_ in k]: Source[k] },
		{ [_ in k]-?: Source[k] },
		// @ts-expect-error force k to index Target
		NonNullable<Target[k]>,
		never
	>;
} & Target;

const from = function <
	This extends new (thing: Record<string, any>) => Record<string, any>,
>(this: This, thing: any) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	return new this(thing);
};

const generateInnerThing = (Default: new (...args: any[]) => any) => {
	const innerThing = function (this: typeof Thing, thing: any) {
		Object.assign(this, new Default(), thing);
	};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	innerThing.from = from as any;

	return innerThing;
};

export const Thing = function (this: typeof Thing | undefined, thing: any) {
	// called with new, currently inside class ctor
	if (this instanceof Thing)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return Object.assign(this!, thing);

	// called without new, currently in class extends expr
	return generateInnerThing;
} as {
	new <T extends Record<string, any>>(thing: T): T;
	<T extends Record<string, any>>(): <
		DefaultProps extends new () => OmitableProps<T>,
	>(
		defaultProps: DefaultProps,
	) => (abstract new (thing: T) => UnomitProps<
		T,
		InstanceType<DefaultProps>
	>) & {
		from<This extends new (thing: T) => T>(
			this: This,
			thing: ConstructorParameters<This>[0],
		): InstanceType<This>;
	};
	from<T extends typeof Thing>(
		this: T,
		thing: ConstructorParameters<T>[0],
	): InstanceType<T>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Thing.from = from as any;
